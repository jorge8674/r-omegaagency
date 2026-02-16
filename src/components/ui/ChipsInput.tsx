// src/components/ui/ChipsInput.tsx
// Responsabilidad única: Input reutilizable de chips/tags

import { useState, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface ChipsInputProps {
  value: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
  label?: string;
  maxChips?: number;
}

export function ChipsInput({
  value,
  onChange,
  placeholder = "Escribe y presiona Enter…",
  label,
  maxChips = 20,
}: ChipsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addChip = (raw: string) => {
    const chip = raw.trim().toLowerCase();
    if (!chip || value.includes(chip) || value.length >= maxChips) return;
    onChange([...value, chip]);
    setInputValue("");
  };

  const removeChip = (chip: string) => {
    onChange(value.filter((c) => c !== chip));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && value.length) {
      removeChip(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((chip) => (
            <Badge key={chip} variant="secondary" className="gap-1 pr-1">
              {chip}
              <button
                type="button"
                onClick={() => removeChip(chip)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label={`Eliminar ${chip}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length >= maxChips ? "Máximo alcanzado" : placeholder}
        disabled={value.length >= maxChips}
      />
    </div>
  );
}
