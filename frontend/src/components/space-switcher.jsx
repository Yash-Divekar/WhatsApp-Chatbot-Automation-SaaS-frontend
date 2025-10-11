import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { GalleryVerticalEnd, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useWorkspace } from "@/context/useWorkspaceContext";

export function SpaceSwitcher() {
  const { workspaces, currentWorkspace, loadWorkspaceById } = useWorkspace();
  const { isMobile } = useSidebar();
  const [activespace, setActivespace] = useState(currentWorkspace);

  useEffect(() => {
    if (currentWorkspace) setActivespace(currentWorkspace);
  }, [currentWorkspace]);

  const handleSelect = async (id) => {
    try {
      await loadWorkspaceById(id);
      const switchedWorkspace = workspaces.find((w) => w.id === id);
      toast.success(`Switched to workspace: ${switchedWorkspace?.name || "Workspace"}`);
    } catch (err) {
      toast.error("Failed to switch workspace.");
    }
  };

  if (!activespace) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-lg`}
            >
              <Avatar className="h-8 w-8 border border-whitep-2">
                <AvatarImage
                  src={currentWorkspace.emblem_logo?.link}
                  alt={currentWorkspace.name}
                />
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentWorkspace.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium">{activespace.name}</span>
              </div>
              <GalleryVerticalEnd className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-[224px] rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-sm">
              Workspaces
            </DropdownMenuLabel>

            {workspaces.map((space, index) => (
              <DropdownMenuItem
                key={space.id}
                onClick={() => handleSelect(space.id)}
                className="gap-2 p-2"
              >
                <Avatar className="w-6 h-6 rounded-full border flex items-center justify-center">
                  <AvatarImage
                    src={activespace?.emblem_logo?.link}
                    alt={space.name}
                  />
                  <AvatarFallback>{space.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{space.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
              <div className="flex w-6 h-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add space</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
