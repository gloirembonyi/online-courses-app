"use client";

interface Category {
  id: string;
  name: string;
}

interface CategoryFiltersProps {
  categories: Category[];
}

export function CategoryFilters({ categories }: CategoryFiltersProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            className="px-6 py-2 rounded-full bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
