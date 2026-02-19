import { useState, useCallback } from "react";

/* ─── Types ──────────────────────────────────── */

export interface ScheduleContentItem {
  generated_text: string;
  content_type: string;
}

export interface ScheduleBlock {
  id: string;
  items: ScheduleContentItem[];
  confirmed: boolean;
  sent: boolean;
  date?: string;
  time: string;
}

interface PlanLimits {
  maxBlocks: number;
  maxItems: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  basico_97: { maxBlocks: 2, maxItems: 3 },
  basic: { maxBlocks: 2, maxItems: 3 },
  pro_197: { maxBlocks: 5, maxItems: 3 },
  pro: { maxBlocks: 5, maxItems: 3 },
  enterprise_497: { maxBlocks: 999, maxItems: 999 },
  enterprise: { maxBlocks: 999, maxItems: 999 },
};

const PLAN_LABELS: Record<string, string> = {
  basico_97: "Plan Básico · 2 bloques · 3 contenidos c/u",
  basic: "Plan Básico · 2 bloques · 3 contenidos c/u",
  pro_197: "Plan Pro · 5 bloques · 3 contenidos c/u",
  pro: "Plan Pro · 5 bloques · 3 contenidos c/u",
  enterprise_497: "Plan Enterprise · Bloques ilimitados",
  enterprise: "Plan Enterprise · Bloques ilimitados",
};

const DEFAULT_LIMITS: PlanLimits = { maxBlocks: 2, maxItems: 3 };

/* ─── Hook ───────────────────────────────────── */

export function useScheduleBlocks(plan?: string | null) {
  const limits = PLAN_LIMITS[plan || ""] || DEFAULT_LIMITS;
  const planLabel = PLAN_LABELS[plan || ""] || "Plan Básico · 2 bloques · 3 contenidos c/u";

  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const makeBlock = (): ScheduleBlock => ({
    id: crypto.randomUUID(), items: [], confirmed: false, sent: false, time: "09:00",
  });

  const addContent = useCallback((item: ScheduleContentItem) => {
    setBlocks(prev => {
      const updated = prev.map(b => ({ ...b, items: [...b.items] }));
      if (updated.length === 0) {
        const nb = { ...makeBlock(), items: [item] };
        setActiveBlockId(nb.id);
        return [nb];
      }
      const target = updated.find(b => b.id === (activeBlockId ?? ""));
      if (target && !target.confirmed && target.items.length < limits.maxItems) {
        target.items.push(item);
      } else if (updated.length < limits.maxBlocks) {
        const nb = { ...makeBlock(), items: [item] };
        updated.push(nb);
        setActiveBlockId(nb.id);
      }
      return updated;
    });
    setOpen(true);
    setMinimized(false);
  }, [activeBlockId, limits]);

  const createBlock = useCallback(() => {
    setBlocks(prev => {
      if (prev.length >= limits.maxBlocks) return prev;
      const nb = makeBlock();
      setActiveBlockId(nb.id);
      return [...prev, nb];
    });
  }, [limits.maxBlocks]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      if (activeBlockId === id) setActiveBlockId(next[0]?.id ?? null);
      return next;
    });
  }, [activeBlockId]);

  const removeContent = useCallback((blockId: string, itemIdx: number) => {
    setBlocks(prev => prev.map(b =>
      b.id === blockId ? { ...b, items: b.items.filter((_, j) => j !== itemIdx) } : b,
    ));
  }, []);

  const setBlockDateTime = useCallback((id: string, date?: string, time?: string) => {
    setBlocks(prev => prev.map(b =>
      b.id === id ? { ...b, ...(date !== undefined && { date }), ...(time !== undefined && { time }) } : b,
    ));
  }, []);

  const confirmAll = useCallback(() => {
    setBlocks(prev => prev.map(b => b.items.length > 0 ? { ...b, confirmed: true } : b));
  }, []);

  const markSent = useCallback((id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, sent: true } : b));
  }, []);

  const reset = useCallback(() => {
    setBlocks([]); setActiveBlockId(null); setOpen(false); setMinimized(false);
  }, []);

  return {
    blocks, activeBlockId, open, minimized, limits, planLabel,
    setActiveBlockId, setOpen, setMinimized,
    addContent, createBlock, deleteBlock, removeContent,
    setBlockDateTime, confirmAll, markSent, reset,
  };
}
