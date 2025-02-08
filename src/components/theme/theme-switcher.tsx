"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder with same dimensions
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
          {theme === "dark" ? (
            <Moon className="w-5 h-5" />
          ) : theme === "light" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Monitor className="w-5 h-5" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[8rem] overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 text-gray-700 shadow-lg animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
          sideOffset={8}
        >
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer select-none items-center rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              theme === "light" && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer select-none items-center rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              theme === "dark" && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer select-none items-center rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              theme === "system" && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => setTheme("system")}
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
