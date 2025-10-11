import React from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Image,
  Video,
  FileText,
  List,
  Layers,
  SquareMousePointer ,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const messageTypes = [
  { type: "text", label: "Text Message", icon: MessageSquare },
  { type: "image", label: "Image Message", icon: Image },
  { type: "video", label: "Video Message", icon: Video },
  { type: "document", label: "Document Message", icon: FileText },
  { type: "quick_reply", label: "Quick Reply", icon: List },
  { type: "list", label: "List Message", icon: Layers },
];

export default function MessageToolbar() {
  const handleAdd = (type) => {
    console.log("Add message:", type);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background/60 backdrop-blur-md border-b border-border">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <SquareMousePointer  className="h-5 w-5 text-primary" />
        Message Builder
      </h2>

      <TooltipProvider>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {messageTypes.map(({ type, label, icon: Icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  onClick={() => handleAdd(type)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
