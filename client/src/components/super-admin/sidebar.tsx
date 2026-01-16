"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  Printer,
  SendToBack,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

type SidebarProps = {
  isOpen: boolean;
  toggle: () => void;
};

const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Create Coupon",
    icon: ListOrdered,
    href: "/super-admin/coupons/add",
  },
  {
    name: "Orders",
    icon: SendToBack,
    href: "/super-admin/orders",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "Logout",
    icon: LogOut,
    href: "",
  },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
  const logout = useAuthStore.getState().logout;
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
    toast.success("Logged out sucessfully!");
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 h-full bg-background transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Button variant={"ghost"} size={"icon"} onClick={toggle}>
          <Menu />
        </Button>
        <h1
          className={cn(
            "font-semibold ml-3 whitespace-nowrap overflow-hidden transition-all duration-300",
            !isOpen && "opacity-0 w-0"
          )}
        >
          Admin Panel
        </h1>
      </div>
      <hr className="border-muted mt-2" />
      <div className="space-y-1 py-4 flex flex-col items-center">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={
              item.name == "Logout"
                ? handleLogout
                : () => router.push(item.href)
            }
            className={cn(
              "flex items-center py-2 px-6 w-full text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            )}
          >
            <item.icon className="size-4 min-w-4" />
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden transition-[width, opacity] duration-300",
                isOpen ? "opacity-100 w-auto ml-3" : "opacity-0 w-0"
              )}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuperAdminSidebar;
