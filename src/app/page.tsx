import { CourseCard } from "@/components/shared/CourseCard";
import { dbClient } from "@/lib/db/client";
import type { Course } from "@/lib/db/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/next-auth";
import { CategoryFilters } from "@/components/shared/CategoryFilters";

export default async function Home() {
  const session = await auth();
  let courses: Course[] = [];
  try {
    courses = await dbClient.getCourses();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  // Mock categories for filtering
  const categories = [
    { id: "all", name: "All" },
    { id: "tech", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Expand Your Knowledge with Our Online Courses
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100">
              Learn from industry experts and advance your career with our
              comprehensive course catalog.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Browse Courses
                </Button>
              </Link>
              {!session && (
                <Link href="/auth/login">
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
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Expert Instructors</h3>
              <p className="mt-2 text-gray-600">
                Learn from professionals with real-world experience.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Flexible Learning</h3>
              <p className="mt-2 text-gray-600">
                Study at your own pace, anywhere and anytime.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Interactive Content</h3>
              <p className="mt-2 text-gray-600">
                Engage with hands-on exercises and real-world projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <CategoryFilters categories={categories} />

      {/* Enhanced Courses Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Featured Courses
        </h2>

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
                className="transform transition-all hover:-translate-y-2 hover:shadow-xl"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl text-gray-300 mb-4">📚</div>
            <p className="text-xl text-gray-600">
              No courses found. Please check back later!
            </p>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-600">
            <p>© 2024 SkillMaster. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="hover:text-blue-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600">
                Careers
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
