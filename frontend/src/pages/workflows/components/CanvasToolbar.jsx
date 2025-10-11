import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ZoomIn, ZoomOut, MessageSquare, Image, Video, FileText, MousePointer } from "lucide-react";
import { useWorkflowStore } from "@/store/WorkflowStore";

export default function CanvasToolbar() {
  const { addNode, setZoom } = useWorkflowStore();

  const handleAdd = (type) => {
    addNode(type);
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleAdd("text")}
        >
          <MessageSquare className="w-4 h-4" /> Text
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleAdd("image")}
        >
          <Image className="w-4 h-4" /> Image
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleAdd("video")}
        >
          <Video className="w-4 h-4" /> Video
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleAdd("document")}
        >
          <FileText className="w-4 h-4" /> Document
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleAdd("interactive")}
        >
          <MousePointer className="w-4 h-4" /> Interactive
        </Button>
      </div>

      <div className="flex gap-2">
        <Button size="icon" variant="ghost" title="Zoom In" onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Zoom Out" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.25))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
