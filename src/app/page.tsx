import React from "react";
import { CourseCard } from "@/components/ui/CourseCard";
import { dbClient } from "@/lib/db/client";
import type { Course } from "@/lib/db/types";

export default async function Home() {
  let courses: Course[] = [];
  try {
    courses = await dbClient.getCourses();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  // Mock categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'tech', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'design', name: 'Design' },
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/pattern.svg')", backgroundSize: '30px' }} />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              Transform Your Career
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up delay-100">
              Master modern skills with expert-led courses and hands-on projects
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up delay-200">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="What do you want to learn today?"
                  className="flex-1 rounded-lg px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 shadow-lg">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
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

      {/* Enhanced Courses Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Featured Courses
        </h2>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl}
                price={Number(course.price)}
                className="transform transition-all hover:-translate-y-2 hover:shadow-xl"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl text-gray-300 mb-4">📚</div>
            <p className="text-xl text-gray-600">No courses found. Please check back later!</p>
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Refresh Courses
            </button>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-600">
            <p>© 2024 SkillMaster. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Careers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}