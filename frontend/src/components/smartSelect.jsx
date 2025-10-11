import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SmartSelect({
  data = [],
  meta = null,
  disabled = false,
  value,
  onChange,
  CustomStyle = "",
}) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = data.find((item) => item.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={(open) => !disabled && setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between h-fit",
            CustomStyle,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {selectedLabel || `Select ${meta || "an option"}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px]">
        <Command>
          <CommandInput
            placeholder={`Select ${meta || "an option"}`}
            className="h-9"
          />
          <CommandList className="max-h-40">
            <CommandEmpty>No {meta || "items"} Found</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(selectedLabel) => {
                    const selected = data.find(
                      (d) => d.label === selectedLabel
                    );
                    if (selected && onChange) {
                      onChange(selected);
                    }
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      item.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
