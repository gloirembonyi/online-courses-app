import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Star, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  className?: string;
  rating?: number;
  studentsCount?: number;
  duration?: string;
  level?: string;
  featured?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  price,
  className,
  rating = 4.5,
  studentsCount = 0,
  duration = "10 hours",
  level = "Beginner",
  featured = false,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden card-hover gradient-border",
        featured && "ring-2 ring-blue-500 dark:ring-blue-400",
        className
      )}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="glass px-3 py-1 rounded-full flex items-center gap-1 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Featured
            </span>
          </div>
        </div>
      )}

      <div className="relative aspect-video overflow-hidden group">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm text-white line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-medium glass rounded-full animate-fade-in">
              {level}
            </span>
            <div className="flex items-center text-yellow-400 animate-fade-in">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          </div>

          <Link href={`/courses/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {studentsCount} students
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold gradient-text">
            ${price.toFixed(2)}
          </div>
          <Link href={`/courses/${id}`}>
            <button className="button-3d px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shine">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
