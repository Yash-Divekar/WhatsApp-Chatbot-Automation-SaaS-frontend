import React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Breadcrumb({ items = [], className }) {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index !== 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="hover:underline text-blue-600"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-lg text-gray-500 font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
