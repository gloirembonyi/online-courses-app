import React from "react";
import { dbClient } from "@/lib/db/client";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await dbClient.getCourseById(params.id);
  const session = await auth();
  const isAuthenticated = !!session?.user;

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-blue-600">
                ${course.price.toFixed(2)}
              </span>
              {!isAuthenticated ? (
                <div className="space-x-4">
                  <Link
                    href="/auth/login"
                    className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Login to Watch
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-block px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                  Start Learning
                </button>
              )}
            </div>

            {isAuthenticated && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Course Content
                </h2>
                <div className="space-y-4">
                  {/* TODO: Add lesson list here */}
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-600">
                      Course content will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
