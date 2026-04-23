import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  helperText?: string;
};

export function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  suggestions = [],
  onSuggestionSelect,
  helperText,
}: FieldProps) {
  const listId = `${id}-suggestions`;
  const visibleSuggestions = suggestions
    .filter((suggestion) => suggestion.trim().length > 0)
    .slice(0, 6);

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
      {helperText ? <p className="text-xs text-surface-500">{helperText}</p> : null}
      {visibleSuggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleSuggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() => (onSuggestionSelect ?? onChange)(suggestion)}
              className="rounded-full border border-white/8 bg-surface-950 px-3 py-1.5 text-xs text-surface-400 transition hover:border-accent-500/40 hover:text-accent-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
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
