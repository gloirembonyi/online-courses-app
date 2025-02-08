"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CourseUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) {
        // 2GB limit
        setError("Video must be less than 2GB");
        return;
      }
      setVideo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch("/api/courses", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload course");
      }

      setSuccess(true);

      // Reset form and state
      e.currentTarget.reset();
      setThumbnail(null);
      setVideo(null);
      setThumbnailPreview("");

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/courses");
      }, 2000);
    } catch (error) {
      console.error("Error uploading course:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload course"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upload New Course
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Course uploaded successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Title
            </label>
            <Input
              name="title"
              type="text"
              placeholder="Enter course title"
              required
              className="w-full"
            />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Enter course description"
              required
              className="w-full min-h-[120px]"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($)
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter course price"
              required
              className="w-full"
            />
          </div>

          {/* Thumbnail Upload */}
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

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Video
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {video ? (
                  <div className="relative inline-block">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <VideoIcon className="w-6 h-6" />
                      <span>{video.name}</span>
                      <button
                        type="button"
                        onClick={() => setVideo(null)}
                        className="bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a video</span>
                        <input
                          type="file"
                          name="video"
                          accept="video/*"
                          className="sr-only"
                          onChange={handleVideoChange}
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      MP4, WebM up to 2GB
                    </p>
                  </>
                )}
              </div>
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
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Course
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
