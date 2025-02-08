"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  BarChart2,
  Plus,
  Settings,
  DollarSign,
  Video,
  BookMarked,
  UserPlus,
  Activity,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const recentActivities = [
  {
    user: "John Doe",
    action: "enrolled in",
    course: "React Masterclass",
    time: "2 minutes ago",
  },
  {
    user: "Jane Smith",
    action: "completed",
    course: "Python Basics",
    time: "1 hour ago",
  },
  {
    user: "Mike Johnson",
    action: "started",
    course: "Web Development",
    time: "3 hours ago",
  },
];

const popularCourses = [
  { title: "React Masterclass", students: 1234, rating: 4.8, progress: 85 },
  { title: "Python Basics", students: 987, rating: 4.7, progress: 72 },
  { title: "Web Development", students: 756, rating: 4.9, progress: 93 },
];

const upcomingEvents = [
  { title: "New Course Launch", date: "Tomorrow, 2:00 PM", type: "launch" },
  { title: "Team Meeting", date: "Today, 4:30 PM", type: "meeting" },
  { title: "Content Review", date: "Friday, 11:00 AM", type: "review" },
];

export default function AdminPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50">
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-700 dark:via-blue-600 dark:to-indigo-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">
                Dashboard Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Welcome back, Admin!
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl mb-4">
              Your platform is growing. You have{" "}
              <span className="font-semibold text-white inline-flex items-center gap-1">
                48 new enrollments <ArrowUpRight className="w-4 h-4" />
              </span>{" "}
              this week.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10"
              >
                View Analytics
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 backdrop-blur-lg"
              >
                <Download className="w-4 h-4 mr-2" /> Download Report
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Total Students Card */}
          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 group backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <span className="flex items-center text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-0.5">
              1,234
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Students
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400 dark:text-gray-500">
                vs last month
              </span>
              <span className="text-green-500 dark:text-green-400 font-medium">
                +123 students
              </span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 group backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <span className="flex items-center text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +8%
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-0.5">
              $45,678
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Revenue
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400 dark:text-gray-500">
                vs last month
              </span>
              <span className="text-green-500 dark:text-green-400 font-medium">
                +$3,457
              </span>
            </div>
          </div>

          {/* Active Courses Card */}
          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 group backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              </div>
              <span className="flex items-center text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-0.5">
              48
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active Courses
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400 dark:text-gray-500">
                vs last month
              </span>
              <span className="text-green-500 dark:text-green-400 font-medium">
                +4 courses
              </span>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 group backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              </div>
              <span className="flex items-center text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2%
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-0.5">
              76%
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Completion Rate
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400 dark:text-gray-500">
                vs last month
              </span>
              <span className="text-green-500 dark:text-green-400 font-medium">
                +2.5%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 backdrop-blur-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                >
                  View All
                </Button>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.user} {activity.action}{" "}
                            <span className="text-blue-600 dark:text-blue-400">
                              {activity.course}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 backdrop-blur-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Upcoming Events
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
            >
              View All Actions
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link href="/admin/courses/upload">
              <Button className="w-full h-auto py-8 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium">Add New Course</span>
                  <span className="text-sm opacity-90 mt-1">
                    Create and publish a new course
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/admin/students">
              <Button className="w-full h-auto py-8 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium">Manage Students</span>
                  <span className="text-sm opacity-90 mt-1">
                    View and manage enrollments
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/admin/courses">
              <Button className="w-full h-auto py-8 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium">Manage Courses</span>
                  <span className="text-sm opacity-90 mt-1">
                    View and edit existing courses
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-500 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Popular Courses
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {popularCourses.map((course, index) => (
                <div
                  key={index}
                  className="group p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-600/30 hover:border-blue-500/20 dark:hover:border-blue-400/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm">{course.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {course.students} students enrolled
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {course.progress}% completion rate
                  </p>
                </div>
              ))}
            </div>
        </div>
      </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link href="/admin/courses" className="group">
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Course Management
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create, edit, and manage your course catalog
              </p>
              <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span>Manage Courses</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/admin/students" className="group">
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
              <div className="flex items-center mb-4">
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Management
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                View and manage student enrollments and progress
              </p>
              <div className="flex justify-between items-center text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                <span>Manage Students</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics" className="group">
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
              <div className="flex items-center mb-4">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analytics
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                View detailed platform statistics and reports
              </p>
              <div className="flex justify-between items-center text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                <span>View Analytics</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
