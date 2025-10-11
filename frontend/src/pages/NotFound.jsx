import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, MoveUpRight } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import navList from "@/lib/navList";
import { SmartSelect } from "@/components/smart-select";
import { Button } from "@/components/ui/button";


export default function NotFound() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  // Prepare options for SmartSelect
  const pageOptions = navList.map((item) => ({
    label: item.title,
    value: item.url,
  }));

  const handleNavigate = () => {
    if (selected?.value) {
      navigate(selected.value);
    }
  };

  return (
    <Empty className="text-center py-20">
      <EmptyHeader>
        <EmptyTitle className="text-2xl font-bold">404 - Page Not Found</EmptyTitle>
        <EmptyDescription className="text-base text-muted-foreground">
          The page you're looking for doesn't exist.  
          Try searching or jump to another page below.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full max-w-sm">
          <SmartSelect
            data={pageOptions}
            meta="page"
            value={selected?.value}
            onChange={(opt) => setSelected(opt)}
            CustomStyle="w-full text-muted-foreground"
          />
          <Button
            onClick={handleNavigate}
            disabled={!selected}
            variant="outline"
            className="flex items-center gap-2 border border-green-400 bg-green-100"
          >
            Visit <MoveUpRight />
          </Button>
        </div>

        <EmptyDescription className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
