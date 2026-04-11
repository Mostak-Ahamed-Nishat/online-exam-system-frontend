import { Clock3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/simple-select";
import { cn } from "@/lib/utils";

export function CreateFormField({
  label,
  required,
  type = "text",
  placeholder,
  disabled,
  register,
  name,
  value,
  onValueChange,
  error,
  options = [],
  min,
  className,
}) {
  const isSelect = type === "select";
  const isTime = type === "time";
  const field = register(name);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-normal text-[var(--test-subtext)]">
        {label} {required ? <span className="text-[var(--button-warning)]">*</span> : null}
      </label>

      <div className="relative">
        {isSelect ? (
          <SimpleSelect
            value={value}
            onChange={onValueChange}
            options={options}
            placeholder={placeholder}
            error={error}
            triggerClassName="text-base font-normal"
          />
        ) : (
          <Input
            {...field}
            type={isTime ? "time" : type}
            placeholder={placeholder}
            disabled={disabled}
            min={type === "number" ? min : undefined}
            onClick={(event) => {
              if (isTime) {
                event.currentTarget.showPicker?.();
              }
            }}
            onKeyDown={(event) => {
              if (type === "number" && ["-", "+", "e", "E"].includes(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              if (type === "number") {
                const cleaned = event.target.value.replace("-", "");
                event.target.value = cleaned;

                if (cleaned !== "") {
                  const numeric = Number(cleaned);
                  if (!Number.isNaN(numeric) && min !== undefined && numeric < min) {
                    event.target.value = String(min);
                  }
                }
              }
              field.onChange(event);
            }}
            className={cn(
              "h-12 rounded-[10px] border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 text-base font-normal placeholder:font-normal",
              isTime ? "time-input cursor-pointer appearance-none pr-11" : "",
              error ? "border-[var(--button-warning)]" : "",
            )}
          />
        )}
        {isTime ? (
          <Clock3 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon-gray)]" />
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-normal text-[var(--button-warning)]">{error}</p>
      ) : null}
    </div>
  );
}

