import React from "react";
import { dbClient } from "@/lib/db/client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { VideoPlayer } from "@/components/shared/VideoPlayer";

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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course not found
          </h1>
          <p className="text-gray-600 mb-8">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = session?.user?.id
    ? await dbClient.isUserEnrolled(session.user.id, course.id)
    : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isEnrolled && course.videoUrl ? (
            <VideoPlayer src={course.videoUrl} title={course.title} />
          ) : (
            <div className="relative aspect-video">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p className="text-white text-lg font-medium">
                  Enroll to watch this course
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 text-lg mb-8">{course.description}</p>

            <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
              <span className="text-3xl font-bold text-blue-600">
                ${course.price.toFixed(2)}
              </span>
              {!isAuthenticated ? (
                <Link href="/auth/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Sign in to Enroll
                  </Button>
                </Link>
              ) : !isEnrolled ? (
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  Enroll Now
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  disabled
                >
                  Enrolled
                </Button>
              )}
            </div>

            {isAuthenticated && isEnrolled && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Course Content
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-600">
                      Continue watching the course video above. Your progress
                      will be automatically saved.
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
