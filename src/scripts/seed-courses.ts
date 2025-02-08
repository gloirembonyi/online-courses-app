import { db } from "@/lib/db";
import { courses, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, and more.",
    imageUrl: "/images/courses/web-dev.jpg",
    videoUrl: "/videos/courses/web-dev-intro.mp4",
    price: "99.99",
    authorId: "", // Will be set dynamically
  },
  {
    title: "Python Programming Masterclass",
    description: "Comprehensive Python course covering basics to advanced concepts, including data science and machine learning fundamentals.",
    imageUrl: "/images/courses/python.jpg",
    videoUrl: "/videos/courses/python-intro.mp4",
    price: "89.99",
    authorId: "", // Will be set dynamically
  },
  {
    title: "UI/UX Design Essentials",
    description: "Learn modern UI/UX design principles, tools, and workflows. Create beautiful and functional user interfaces.",
    imageUrl: "/images/courses/ui-ux.jpg",
    videoUrl: "/videos/courses/design-intro.mp4",
    price: "79.99",
    authorId: "", // Will be set dynamically
  },
  {
    title: "Digital Marketing Strategy",
    description: "Master digital marketing strategies, SEO, social media marketing, and content creation for business growth.",
    imageUrl: "/images/courses/marketing.jpg",
    videoUrl: "/videos/courses/marketing-intro.mp4",
    price: "69.99",
    authorId: "", // Will be set dynamically
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps using React Native. Deploy to iOS and Android with a single codebase.",
    imageUrl: "/images/courses/react-native.jpg",
    videoUrl: "/videos/courses/react-native-intro.mp4",
    price: "89.99",
    authorId: "", // Will be set dynamically
  },
  {
    title: "Data Science and Analytics",
    description: "Learn data analysis, visualization, and machine learning using Python, Pandas, and scikit-learn.",
    imageUrl: "/images/courses/data-science.jpg",
    videoUrl: "/videos/courses/data-science-intro.mp4",
    price: "94.99",
    authorId: "", // Will be set dynamically
  },
];

async function seedCourses() {
  try {
    console.log("🌱 Seeding courses...");

    // Get admin user ID
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@example.com"));

    if (!adminUser) {
      throw new Error("Admin user not found! Please run create-admin script first.");
    }

    // Add admin ID to all courses
    const coursesWithAuthor = sampleCourses.map(course => ({
      ...course,
      authorId: adminUser.id
    }));

    for (const course of coursesWithAuthor) {
      await db.insert(courses).values(course);
      console.log(`✅ Created course: ${course.title}`);
    }

    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
}

seedCourses(); 