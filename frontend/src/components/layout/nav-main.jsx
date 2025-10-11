import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function NavMain({ items }) {
  const [activeItem, setActiveItem] = useState(
    items.find((item) => item.isActive)?.title || items[0]?.title
  );
  const navigate = useNavigate();

  const handleClick = (title, url) => {
    setActiveItem(title);
    navigate(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide text-muted-foreground">
        Actions
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = activeItem === item.title;

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <button
                    onClick={() => handleClick(item.title, item.url)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
                      transition-all duration-200
                      ${
                        isActive
                          ? "border-l-4 px-2 border-blue-500 bg-blue-500/10 text-blue-600 font-semibold hover:bg-blue-200 hover:text-blue-600"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon
                      size={28}
                      className={isActive ? "text-blue-600" : "text-muted-foreground"}
                    />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform">
                        <ChevronRight size={18} />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = activeItem === subItem.title;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <button
                                  onClick={() => handleClick(subItem.title, subItem.url)}
                                  className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    isSubActive
                                      ? "text-blue-600 bg-blue-500/10"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
