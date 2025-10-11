import React from "react";
import CanvasToolbar from "./components/CanvasToolbar";
import CanvasArea from "./components/CanvasArea";
import PropertiesPanel from "./components/PropertiesPanel";

export default function WorkflowCanvas() {
  return (
    <div className="flex h-full w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Canvas Section */}
      <div className="flex flex-col flex-1 relative overflow-hidden border-r border-gray-200">
        <CanvasToolbar />
        <CanvasArea />
      </div>

      {/* Right Panel */}
      <PropertiesPanel />
    </div>
  );
}
