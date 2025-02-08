import { dbClient } from "@/lib/db/client";
import { CourseCard } from "@/components/shared/CourseCard";
import { CategoryFilters } from "@/components/shared/CategoryFilters";
import { RainAnimation } from "@/components/shared/RainAnimation";
import {
  Sparkles,
  BookOpen,
  Code,
  Palette,
  TrendingUp,
  Database,
  Rocket,
} from "lucide-react";

const categories = [
  { id: "all", name: "All Courses", icon: "🎓" },
  { id: "tech", name: "Technology", icon: "💻", featured: true },
  { id: "business", name: "Business", icon: "💼" },
  { id: "design", name: "Design", icon: "🎨" },
  { id: "marketing", name: "Marketing", icon: "📈" },
  { id: "development", name: "Development", icon: "⚡", featured: true },
];

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals",
  },
  {
    icon: Code,
    title: "Hands-on Projects",
    description: "Build real-world applications",
  },
  {
    icon: Palette,
    title: "Modern Curriculum",
    description: "Stay ahead with latest tech",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Advance your career path",
  },
];

export default async function CoursesPage() {
  const courses = await dbClient.getCourses();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        {/* <RainAnimation />
        <ParticlesAnimation /> */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-100 glow">
              <Sparkles className="w-4 h-4" />
              <span>Discover Your Next Skill</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto inspiring-text">
              Unlock Your Potential with Expert-Led Courses
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto wave">
              Choose from our diverse range of courses and start your learning
              journey today
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass p-6 rounded-xl float-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 sparkle">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="sticky top-16 z-10 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CategoryFilters categories={categories} />
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 inspiring-text">
            Available Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our collection of high-quality courses
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="animate-slide-up float-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.imageUrl}
                  price={Number(course.price)}
                  featured={index < 2}
                  studentsCount={Math.floor(Math.random() * 1000)}
                  duration={`${Math.floor(Math.random() * 20 + 5)} hours`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4 sparkle">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new courses!
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        {/* <RainAnimation />
        <ParticlesAnimation /> */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white inspiring-text">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 wave">
              Join thousands of learners who are advancing their careers through
              our comprehensive course catalog.
            </p>
            <button className="px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors button-3d shine glow">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
