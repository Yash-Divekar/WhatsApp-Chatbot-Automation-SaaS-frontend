import {
  House,
  GitFork,
  FolderGit2,
  BotMessageSquare,
  ChartNoAxesCombined,
} from "lucide-react";

import {Home, Workflows, NewWorkflow, Stimulate, Analytics} from "@/pages"

const navList = [
  { title: "Home",
    url: "/home",
    icon: House,
    page: Home,
    isActive: true },
  {
    title: "New Workflow",
    url: "/workflow/new",
    icon: GitFork,
    page: NewWorkflow,
    isActive: false,
  },
  { title: "Workflows",
    url: "/workflows",
    icon: FolderGit2,
    page: Workflows,
    isActive: false },
  {
    title: "Stimulate",
    url: "/stimulate",
    icon: BotMessageSquare,
    page: Stimulate,
    isActive: false,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartNoAxesCombined,
    page : Analytics,
    isActive: false,
  },
];

export default navList;
