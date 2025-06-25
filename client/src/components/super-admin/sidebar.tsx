"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
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
    name: "Orders",
    icon: SendToBack,
    href: "super-admin/orders",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "super-admin/coupons/list",
  },
  {
    name: "Create Coupon",
    icon: ListOrdered,
    href: "super-admin/coupons/add",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "super-admin/settings",
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
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h1
          className={cn(
            "font-semibold transition-all duration-300",
            !isOpen && "hidden"
          )}
        >
          Admin Panel
        </h1>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="ml-auto"
          onClick={toggle}
        >
          {isOpen ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </div>
      <div className="space-y-1 py-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={
              item.name == "Logout"
                ? handleLogout
                : () => router.push(item.href)
            }
            className={cn(
              "flex items-center j px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            )}
          >
            <item.icon className="size-4" />
            <span
              className={cn(
                "ml-3 transition-all duration-300",
                !isOpen && "hidden"
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
