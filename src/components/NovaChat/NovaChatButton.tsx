// 42 lines
import { Crown } from "lucide-react";

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

export function NovaChatButton({ onClick, isOpen }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir chat con NOVA"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        rounded-full px-4 py-3
        border-2 border-yellow-500/70
        bg-yellow-500/10 backdrop-blur-sm
        shadow-lg shadow-yellow-500/20
        text-yellow-400 font-semibold text-sm
        transition-all duration-200
        hover:bg-yellow-500/20 hover:scale-105
        ${isOpen ? "opacity-80 scale-95" : ""}
      `}
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
      </span>
      <Crown className="h-4 w-4" />
      NOVA
    </button>
  );
}
