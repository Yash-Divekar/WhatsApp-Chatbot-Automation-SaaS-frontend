import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import PageLoader from "@/components/pageLoader";

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="p-0 w-full h-full">
            <AppRoutes />
          </main>
          <Toaster richColors position="bottom-left" />
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}
