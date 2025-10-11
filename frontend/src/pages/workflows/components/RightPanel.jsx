import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RightPanel() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">
            Select a node to view and edit its data.
          </p>
        </div>

        {!selectedType && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <p>No message selected</p>
          </div>
        )}

        {selectedType && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message Name</label>
              <Input placeholder="Enter message name" />
            </div>

            <div>
              <label className="text-sm font-medium">Body</label>
              <Textarea rows="4" placeholder="Message content..." />
            </div>

            <Button className="w-full mt-4">Save</Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
