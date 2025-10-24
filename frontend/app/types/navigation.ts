import { LucideIcon } from "lucide-react";

export type NavigationItem = {
  name: string;
  href?: string;
   icon?: LucideIcon;
  action?: () => void;
};

export type Navigation = Record<"admin" | "user", NavigationItem[]>;