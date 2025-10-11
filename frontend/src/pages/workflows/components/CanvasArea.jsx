import React from "react";

export default function CanvasArea() {
  return (
    <div className="w-full h-full relative bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden select-none">
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground font-medium pointer-events-none">
        🧱 Drag or Add Message Nodes
      </div>

      <div className="absolute bottom-2 right-4 text-xs text-muted-foreground/70 bg-background/70 px-2 py-1 rounded-md border">
        Zoom: 100%
      </div>
    </div>
  );
}
