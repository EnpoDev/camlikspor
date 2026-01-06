"use client";

import * as React from "react";
import { formatTurkishPhone } from "@/lib/utils/validation";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "type"> {
  defaultValue?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, defaultValue = "", name, id, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (rawValue) {
        const formatted = formatTurkishPhone(rawValue);
        setValue(formatted);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <input
        type="tel"
        data-phone-input="true"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0XXX XXX XX XX"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
