import { SidebarIcon, SearchIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/breadcrumb";
import { SmartSelect } from "@/components/smart-select";
import navList from "@/lib/navList";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumb items dynamically based on current path
  const breadcrumbItems = location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => {
      const path = "/" + arr.slice(0, idx + 1).join("/");
      const item = navList.find((nav) => nav.url === path);
      return { label: item?.title || seg, href: idx === arr.length - 1 ? null : path };
    });

  const pageOptions = navList.map((item) => ({ label: item.title, value: item.url }));

  const handleSelectPage = (selected) => {
    if (selected?.value) navigate(selected.value);
  };

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background px-4">
      <div className="flex items-center gap-2 h-[var(--header-height)] w-full">
        {/* Sidebar toggle */}
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} className="hidden sm:flex ml-2" />

        {/* Page search / dashboard search */}
        <div className="ml-auto w-full max-w-xs sm:max-w-sm">
          <SmartSelect
            data={pageOptions}
            meta="page"
            onChange={handleSelectPage}
            CustomStyle="w-full"
          />
        </div>
      </div>
    </header>
  );
}
