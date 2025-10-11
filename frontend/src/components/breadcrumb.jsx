import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ items = [], className }) {
  if (!items.length) return null;

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index !== 0 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
          {item.href ? (
            <a
              href={item.href}
              className="hover:underline text-blue-600 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
