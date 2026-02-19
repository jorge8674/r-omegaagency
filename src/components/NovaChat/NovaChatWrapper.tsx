// 30 lines — NovaChatWrapper: mounts floating NOVA chat, owner-only
import { useState } from "react";
import { NovaChat } from "./NovaChat";
import { NovaChatButton } from "./NovaChatButton";
import { useOmegaAuth } from "@/contexts/AuthContext";

export function NovaChatWrapper() {
  const { user } = useOmegaAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Only visible for owner/super_admin
  if (!user || user.role !== "owner") return null;

  return (
    <>
      {(!open || minimized) && (
        <NovaChatButton
          onClick={() => { setOpen(true); setMinimized(false); }}
          isOpen={open && !minimized}
        />
      )}
      {open && !minimized && (
        <NovaChat
          onClose={() => setOpen(false)}
          onMinimize={() => setMinimized(true)}
        />
      )}
    </>
  );
}
