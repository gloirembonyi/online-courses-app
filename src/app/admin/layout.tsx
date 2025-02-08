"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  Settings,
  Library,
  Bell,
  MessageSquare,
  HelpCircle,
  Search,
  Menu,
  X,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: BookOpen, label: "Courses", href: "/admin/courses" },
      { icon: Users, label: "Students", href: "/admin/students" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Library, label: "Library", href: "/admin/content" },
      { icon: Calendar, label: "Schedule", href: "/admin/schedule" },
      { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/admin/settings" },
      { icon: HelpCircle, label: "Help Center", href: "/admin/help" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Backdrop for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky top-0 left-0 z-30 h-screen bg-white/80 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700/50 transition-all duration-300 backdrop-blur-xl",
            isSidebarOpen ? "w-64" : "w-20",
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div
              className={cn(
                "flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700/50",
                !isSidebarOpen && "justify-center"
              )}
            >
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                {isSidebarOpen && (
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Course Admin
                  </span>
                )}
              </Link>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Search and Navigation Container */}
              <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto no-scrollbar">
                {/* Search Bar */}
                {isSidebarOpen && (
                  <div className="sticky top-0 pb-4">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 dark:text-gray-300 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <nav className="space-y-6">
                  {sidebarItems.map((section, idx) => (
                    <div key={idx}>
                      {isSidebarOpen && (
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                          {section.label}
                        </h3>
                      )}
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shadow-sm"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
                                !isSidebarOpen && "justify-center"
                              )}
                              title={!isSidebarOpen ? item.label : undefined}
                            >
                              <item.icon
                                className={cn(
                                  "flex-shrink-0 transition-colors",
                                  isSidebarOpen ? "w-5 h-5 mr-3" : "w-6 h-6",
                                  isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                                )}
                              />
                              {isSidebarOpen && (
                                <span className="truncate">{item.label}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute -right-4 top-20 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen overflow-hidden">
          {/* Top Navigation */}
          <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                  {sidebarItems
                    .flatMap((section) => section.items)
                    .find((item) => item.href === pathname)?.label ||
                    "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
