"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon?: string;
  featured?: boolean;
}

interface CategoryFiltersProps {
  categories: Category[];
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryFilters({
  categories,
  onCategoryChange,
}: CategoryFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="glass rounded-xl p-2">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                {category.icon && (
                  <span className="text-lg">{category.icon}</span>
                )}
                {category.name}
                {category.featured && (
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse-slow" />
                )}
              </div>

              {selectedCategory === category.id && (
                <motion.div
                  layoutId="categoryHighlight"
                  className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
