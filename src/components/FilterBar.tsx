import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

export interface FilterField {
  key: string;
  label: string;
  type: "search" | "select" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  hasActive: boolean;
}

function DatePickerField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const date = value ? new Date(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 text-sm",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 mr-2" />
          {date ? format(date, "MMM d, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? d.toISOString().slice(0, 10) : "")}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

function FilterFields({ fields, values, onChange }: Pick<FilterBarProps, "fields" | "values" | "onChange">) {
  return (
    <>
      {fields.map((f) => (
        <div key={f.key} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
          {f.type === "search" && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={values[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder || "Search..."}
                className="pl-8 h-9 text-sm"
              />
            </div>
          )}
          {f.type === "select" && (
            <Select value={values[f.key] || ""} onValueChange={(v) => onChange(f.key, v === "__all__" ? "" : v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={f.placeholder || "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All</SelectItem>
                {f.options?.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {f.type === "date" && (
            <DatePickerField
              value={values[f.key] || ""}
              onChange={(v) => onChange(f.key, v)}
              placeholder={f.placeholder || "Select date"}
            />
          )}
        </div>
      ))}
    </>
  );
}

export function FilterBar({ fields, values, onChange, onReset, hasActive }: FilterBarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="sticky top-[64px] z-20 -mx-4 px-4 py-2 bg-background/85 backdrop-blur-xl border-b border-border/60 flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filters
              {hasActive && (
                <span className="h-2 w-2 rounded-full bg-accent" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <FilterFields fields={fields} values={values} onChange={onChange} />
              <div className="flex gap-2 pt-2">
                {hasActive && (
                  <Button variant="outline" size="sm" onClick={() => { onReset(); setOpen(false); }} className="gap-1">
                    <X className="h-3.5 w-3.5" /> Reset
                  </Button>
                )}
                <Button size="sm" onClick={() => setOpen(false)} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-muted-foreground gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-[72px] z-20 bg-card/95 backdrop-blur-xl rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">Filters</span>
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto text-xs text-muted-foreground gap-1 h-7">
            <X className="h-3 w-3" /> Reset Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <FilterFields fields={fields} values={values} onChange={onChange} />
      </div>
    </div>
  );
}
