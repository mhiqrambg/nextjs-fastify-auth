import { Input } from "@heroui/react";
import { useState, useEffect, useMemo } from "react";
import { BrushCleaning } from "lucide-react";

export default function ClassSearch({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear?: () => void;
}) {
  const [text, setText] = useState(value);

  const debounced = useMemo(() => {
    let t: any;
    return (v: string) => {
      clearTimeout(t);
      t = setTimeout(() => onChange(v), 400);
    };
  }, [onChange]);

  useEffect(() => setText(value), [value]);

  const handleClear = () => {
    setText("");
    onChange("");
    onClear?.();
  };

  return (
    <Input
      placeholder="Cari kelas…"
      value={text}
      onChange={(e) => {
        const val = e.target.value;
        setText(val);
        debounced(val);
        if (val === "") onClear?.();
      }}
      startContent={
        <BrushCleaning
          className="text-default-500 cursor-pointer"
          onClick={handleClear}
          size={20}
        />
      }
      variant="underlined"
      className="w-46 transition-all duration-500 sm:w-80"
    />
  );
}
