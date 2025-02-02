import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  price,
}: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-lg">
      <Link href={`/courses/${id}`}>
        <div className="aspect-video w-full relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              ${price.toFixed(2)}
            </span>
            <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              View Course
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
