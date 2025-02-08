"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, Upload, ImageIcon, VideoIcon } from "lucide-react";

interface Lesson {
  title: string;
  description: string;
  videoFile: File | null;
  position: number;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([
    { title: "", description: "", videoFile: null, position: 1 },
  ]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail must be less than 5MB");
        return;
      }
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLessonVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setError("Video must be less than 500MB");
        return;
      }
      const updatedLessons = [...lessons];
      updatedLessons[index].videoFile = file;
      setLessons(updatedLessons);
    }
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        videoFile: null,
        position: lessons.length + 1,
      },
    ]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      // Update positions
      updatedLessons.forEach((lesson, i) => {
        lesson.position = i + 1;
      });
      setLessons(updatedLessons);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      const courseData = {
        title: (e.currentTarget.elements.namedItem("title") as HTMLInputElement)
          .value,
        description: (
          e.currentTarget.elements.namedItem(
            "description"
          ) as HTMLTextAreaElement
        ).value,
        price: parseFloat(
          (e.currentTarget.elements.namedItem("price") as HTMLInputElement)
            .value
        ),
      };

      // Add course data
      Object.entries(courseData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Add thumbnail
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Add lessons
      lessons.forEach((lesson, index) => {
        formData.append(`lessons[${index}][title]`, lesson.title);
        formData.append(`lessons[${index}][description]`, lesson.description);
        formData.append(
          `lessons[${index}][position]`,
          lesson.position.toString()
        );
        if (lesson.videoFile) {
          formData.append(`lessons[${index}][video]`, lesson.videoFile);
        }
      });

      const response = await fetch("/api/courses", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create course");
      }

      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create course"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Course
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title
                </label>
                <Input
                  name="title"
                  required
                  placeholder="Enter course title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  required
                  placeholder="Enter course description"
                  className="w-full min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($)
                </label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter course price"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Thumbnail
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {thumbnailPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="max-h-40 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a thumbnail</span>
                            <input
                              type="file"
                              name="thumbnail"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleThumbnailChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lessons
                </h2>
                <Button
                  type="button"
                  onClick={addLesson}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Lesson
                </Button>
              </div>

              <div className="space-y-6">
                {lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Lesson {lesson.position}
                      </h3>
                      {lessons.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeLesson(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lesson Title
                        </label>
                        <Input
                          value={lesson.title}
                          onChange={(e) => {
                            const updatedLessons = [...lessons];
                            updatedLessons[index].title = e.target.value;
                            setLessons(updatedLessons);
                          }}
                          required
                          placeholder="Enter lesson title"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lesson Description
                        </label>
                        <Textarea
                          value={lesson.description}
                          onChange={(e) => {
                            const updatedLessons = [...lessons];
                            updatedLessons[index].description = e.target.value;
                            setLessons(updatedLessons);
                          }}
                          required
                          placeholder="Enter lesson description"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lesson Video
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            {lesson.videoFile ? (
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <VideoIcon className="w-6 h-6" />
                                <span>{lesson.videoFile.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedLessons = [...lessons];
                                    updatedLessons[index].videoFile = null;
                                    setLessons(updatedLessons);
                                  }}
                                  className="bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                    <span>Upload a video</span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="sr-only"
                                      onChange={(e) =>
                                        handleLessonVideoChange(e, index)
                                      }
                                      required
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  MP4, WebM up to 500MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
