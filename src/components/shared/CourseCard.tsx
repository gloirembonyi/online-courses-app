interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  price,
  className,
}: CourseCardProps) {
  return <div className={className}>// ... existing code ...</div>;
}
