import React from "react";
import MessageToolbar from "./components/MessageToolbar";
import CanvasArea from "./components/CanvasArea";
import RightPanel from "./components/RightPanel";

export default function NewWorkflow() {
  return (
    <div className="flex flex-col w-full h-full bg-muted/20 rounded-2xl overflow-hidden border border-border shadow-lg">
      {/* Toolbar */}
      <div className="border-b border-border bg-gradient-to-r from-background/70 to-background/30 backdrop-blur-md sticky top-0 z-10">
        <MessageToolbar />
      </div>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <CanvasArea />
        </div>

        {/* Right-side Property Panel */}
        <div className="w-96 min-w-[300px] border-l border-border bg-card/70 backdrop-blur-xl shadow-inner overflow-y-auto">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
