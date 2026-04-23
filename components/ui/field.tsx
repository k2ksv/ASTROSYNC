import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions?: string[];
};

export function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  suggestions = [],
}: FieldProps) {
  const listId = `${id}-suggestions`;

  return (
    <label className="block space-y-3">
      <span className="text-sm font-medium text-surface-400">{label}</span>
      <input
        list={suggestions.length > 0 ? listId : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border border-white/8 bg-surface-800 px-4 py-3 text-sm text-surface-300 outline-none transition",
          "placeholder:text-surface-500 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
        )}
      />
      {suggestions.length > 0 ? (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option value={suggestion} key={suggestion} />
          ))}
        </datalist>
      ) : null}
    </label>
  );
}
