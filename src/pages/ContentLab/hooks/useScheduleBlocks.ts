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

const DEFAULT_LIMITS: PlanLimits = { maxBlocks: 2, maxItems: 3 };

/* ─── Hook ───────────────────────────────────── */

export function useScheduleBlocks(plan?: string | null) {
  const limits = PLAN_LIMITS[plan || ""] || DEFAULT_LIMITS;
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const addContent = useCallback((item: ScheduleContentItem) => {
    setBlocks(prev => {
      const updated = prev.map(b => ({ ...b, items: [...b.items] }));

      if (updated.length === 0) {
        return [{ id: crypto.randomUUID(), items: [item], confirmed: false }];
      }

      const targetIdx = updated.findIndex(
        b => !b.confirmed && b.items.length < limits.maxItems,
      );

      if (targetIdx >= 0) {
        updated[targetIdx].items.push(item);
        setActiveIndex(targetIdx);
      } else if (updated.length < limits.maxBlocks) {
        updated.push({ id: crypto.randomUUID(), items: [item], confirmed: false });
        setActiveIndex(updated.length - 1);
      }

      return updated;
    });
    setOpen(true);
    setMinimized(false);
  }, [limits]);

  const createBlock = useCallback(() => {
    setBlocks(prev => {
      if (prev.length >= limits.maxBlocks) return prev;
      const next = [...prev, { id: crypto.randomUUID(), items: [], confirmed: false }];
      setActiveIndex(next.length - 1);
      return next;
    });
  }, [limits.maxBlocks]);

  const deleteBlock = useCallback((index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
    setActiveIndex(i => Math.max(0, i >= index ? i - 1 : i));
  }, []);

  const confirmBlock = useCallback((index: number) => {
    setBlocks(prev =>
      prev.map((b, i) => (i === index ? { ...b, confirmed: true } : b)),
    );
  }, []);

  const removeContent = useCallback((blockIdx: number, itemIdx: number) => {
    setBlocks(prev =>
      prev.map((b, i) =>
        i === blockIdx ? { ...b, items: b.items.filter((_, j) => j !== itemIdx) } : b,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    setBlocks([]);
    setActiveIndex(0);
    setOpen(false);
    setMinimized(false);
  }, []);

  return {
    blocks, activeIndex, open, minimized, limits,
    setActiveIndex, setOpen, setMinimized,
    addContent, createBlock, deleteBlock, confirmBlock, removeContent, reset,
  };
}
