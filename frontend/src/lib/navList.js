import {
  House,
  GitFork,
  FolderGit2,
  BotMessageSquare,
  ChartNoAxesCombined,
} from "lucide-react";

import { Home, Workflows, Stimulate, Analytics } from "@/pages";
import NewWorkflow from "@/pages/workflows/index"
const navList = [
  {
    title: "Home",
    url: "/home",
    icon: House,
    page: Home,
  },
  {
    title: "New Workflow",
    url: "/workflows/new",
    icon: GitFork,
    page: NewWorkflow,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: FolderGit2,
    page: Workflows,
  },
  {
    title: "Stimulate",
    url: "/stimulate",
    icon: BotMessageSquare,
    page: Stimulate,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartNoAxesCombined,
    page: Analytics,
  },
];

export default navList;
