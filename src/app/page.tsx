import { CourseCard } from "@/components/shared/CourseCard";
import { dbClient } from "@/lib/db/client";
import type { Course } from "@/lib/db/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { CategoryFilters } from "@/components/shared/CategoryFilters";
import { Sparkles, BookOpen, Users, Clock, Star } from "lucide-react";

export default async function Home() {
  const session = await auth();
  let courses: Course[] = [];
  try {
    courses = await dbClient.getCourses();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  const categories = [
    { id: "all", name: "All" },
    { id: "tech", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "development", name: "Development" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description:
        "Learn from industry professionals with real-world experience",
    },
    {
      icon: Users,
      title: "Interactive Learning",
      description:
        "Engage with peers and instructors in a collaborative environment",
    },
    {
      icon: Clock,
      title: "Self-Paced",
      description:
        "Learn at your own pace with lifetime access to course content",
    },
    {
      icon: Star,
      title: "Certificate",
      description: "Earn a certificate upon completion of each course",
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Transform your career with our courses</span>
            </div>
            <div className="max-w-4xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Master New Skills with Expert-Led Online Courses
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Join thousands of learners who are advancing their careers
                through our comprehensive course catalog.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Browse Courses
                  </Button>
                </Link>
                {!session && (
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Sign In to Start Learning
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide the tools and resources you need to succeed in your
              learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white dark:bg-gray-800 py-4 sticky top-16 z-10 border-b border-gray-200 dark:border-gray-700">
        <CategoryFilters categories={categories} />
      </div>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our most popular and highly-rated courses
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.imageUrl}
                  price={Number(course.price)}
                  className="transform transition-all hover:-translate-y-1 hover:shadow-xl"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses available yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for new courses!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                1,000+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Active Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Expert Instructors
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Courses Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                95%
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards your
            goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Explore Courses
              </Button>
            </Link>
            {!session && (
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
