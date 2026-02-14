"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  UserPlus,
  Users,
  Dumbbell,
  UsersRound,
  ClipboardCheck,
  Calculator,
  FileText,
  MessageSquare,
  UserCog,
  Settings,
  Building2,
  ChevronDown,
  Banknote,
  Package,
  ShoppingCart,
  Store,
  Coins,
  ClipboardList,
  BookOpen,
  Target,
  Calendar,
} from "lucide-react";
import { UserRole } from "@/lib/types";
import {
  getAccessibleMenuItems,
  type MenuItem,
} from "@/lib/utils/permissions";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const iconMap: Record<string, React.ElementType> = {
  dashboard: Home,
  "pre-registration": UserPlus,
  students: Users,
  trainers: Dumbbell,
  groups: UsersRound,
  attendance: ClipboardCheck,
  accounting: Calculator,
  reports: FileText,
  sms: MessageSquare,
  users: UserCog,
  settings: Settings,
  dealers: Building2,
  "dealer-payments": Banknote,
  products: Package,
  orders: ShoppingCart,
  "sub-dealers": Store,
  commissions: Coins,
  training: ClipboardList,
  "training-plans": BookOpen,
  "tactical-board": Target,
  "training-calendar": Calendar,
};

interface SidebarProps {
  locale: string;
  userRole: UserRole;
  userPermissions: string[];
  dictionary: Dictionary["sidebar"];
  isMobile?: boolean;
}

function SidebarItem({
  item,
  locale,
  currentPath,
  dictionary,
}: {
  item: MenuItem;
  locale: string;
  currentPath: string;
  dictionary: Dictionary["sidebar"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[item.key] || Home;
  const href = `/${locale}${item.href}`;
  // For items with children, use startsWith for active state
  // For items without children, use exact match only
  const hasChildren = item.children && item.children.length > 0;
  const isActive = hasChildren
    ? currentPath === href || currentPath.startsWith(`${href}/`)
    : currentPath === href;

  // Get label from dictionary
  const labelKey = item.labelKey.split(".")[1] as keyof Dictionary["sidebar"];
  const label = dictionary[labelKey] || item.key;

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <SidebarItem
                key={child.key}
                item={child}
                locale={locale}
                currentPath={currentPath}
                dictionary={dictionary}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({
  locale,
  userRole,
  userPermissions,
  dictionary,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const menuItems = getAccessibleMenuItems(userPermissions, userRole);

  return (
    <aside className={cn(
      "flex flex-col w-64 border-sidebar-border bg-sidebar text-sidebar-foreground",
      isMobile ? "h-full border-0" : "hidden lg:flex border-r"
    )}>
      <div className="p-4 border-b border-sidebar-border">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-white">
            <Image
              src="/logo.png"
              alt="Çamlık Spor"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-sidebar-foreground">Ümraniye Çamlık</span>
            <span className="text-xs text-sidebar-foreground/60">Spor Kulübü</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            locale={locale}
            currentPath={pathname}
            dictionary={dictionary}
          />
        ))}
      </nav>
    </aside>
  );
}
