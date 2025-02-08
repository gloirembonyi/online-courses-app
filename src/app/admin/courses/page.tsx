import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { dbClient } from "@/lib/db/client";
import Image from "next/image";

export default async function AdminCoursesPage() {
  const courses = await dbClient.getCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Courses Management
        </h1>
        <Link href="/admin/courses/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="relative aspect-video">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${Number(course.price).toFixed(2)}
                </span>
                <Link href={`/admin/courses/${course.id}`}>
                  <Button variant="outline">Manage Course</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first course
            </p>
            <Link href="/admin/courses/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
