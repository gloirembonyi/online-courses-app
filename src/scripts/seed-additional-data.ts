import { db } from "@/lib/db";
import { users, courses, lessons, enrollments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createId } from '@paralleldrive/cuid2';

// Sample lesson data for each course type
const lessonTemplates = {
  webdev: [
    { title: "Introduction to Web Development", description: "Overview of web development and course structure" },
    { title: "HTML Fundamentals", description: "Learn the basics of HTML markup and document structure" },
    { title: "CSS Styling", description: "Master CSS styling and responsive design principles" },
    { title: "JavaScript Basics", description: "Introduction to JavaScript programming" },
    { title: "Building Interactive UIs", description: "Create dynamic user interfaces with JavaScript" }
  ],
  python: [
    { title: "Python Basics", description: "Introduction to Python programming language" },
    { title: "Data Structures", description: "Understanding Python data structures and their usage" },
    { title: "Functions and OOP", description: "Learn about functions and object-oriented programming" },
    { title: "Working with Libraries", description: "Using popular Python libraries and packages" },
    { title: "Building Projects", description: "Hands-on project development with Python" }
  ],
  design: [
    { title: "Design Principles", description: "Understanding core design principles and theory" },
    { title: "User Research", description: "Learn how to conduct effective user research" },
    { title: "Wireframing", description: "Create wireframes and low-fidelity prototypes" },
    { title: "UI Design", description: "Master user interface design techniques" },
    { title: "Prototyping", description: "Build interactive prototypes with design tools" }
  ]
};

// Sample student data
const sampleStudents = [
  { email: "student1@example.com", name: "John Doe", password: "student123" },
  { email: "student2@example.com", name: "Jane Smith", password: "student123" },
  { email: "student3@example.com", name: "Mike Johnson", password: "student123" },
];

async function seedAdditionalData() {
  try {
    console.log("🌱 Seeding additional data...\n");

    // 1. Create student users
    console.log("Creating student users...");
    const createdStudents = [];
    for (const student of sampleStudents) {
      const hashedPassword = await bcrypt.hash(student.password, 10);
      const [createdStudent] = await db.insert(users).values({
        email: student.email,
        name: student.name,
        hashedPassword,
        isAdmin: false,
        mfaEnabled: false
      }).returning();
      createdStudents.push(createdStudent);
      console.log(`✅ Created student: ${student.name}`);
    }

    // 2. Get all courses
    const allCourses = await db.select().from(courses);
    
    // 3. Add lessons to each course
    console.log("\nCreating lessons for courses...");
    for (const course of allCourses) {
      // Determine which lesson template to use based on course title
      let template = lessonTemplates.webdev;
      if (course.title.toLowerCase().includes("python")) {
        template = lessonTemplates.python;
      } else if (course.title.toLowerCase().includes("design")) {
        template = lessonTemplates.design;
      }

      // Create lessons for the course
      for (let i = 0; i < template.length; i++) {
        const lesson = template[i];
        await db.insert(lessons).values({
          title: lesson.title,
          description: lesson.description,
          videoUrl: `/videos/courses/lesson-${i + 1}.mp4`, // Placeholder video URL
          courseId: course.id,
          position: i + 1
        });
      }
      console.log(`✅ Created lessons for: ${course.title}`);
    }

    // 4. Create enrollments
    console.log("\nCreating student enrollments...");
    for (const student of createdStudents) {
      // Enroll each student in 2-3 random courses
      const numEnrollments = 2 + Math.floor(Math.random() * 2); // 2 or 3
      const shuffledCourses = [...allCourses].sort(() => Math.random() - 0.5);
      const selectedCourses = shuffledCourses.slice(0, numEnrollments);

      for (const course of selectedCourses) {
        await db.insert(enrollments).values({
          userId: student.id,
          courseId: course.id
        });
        console.log(`✅ Enrolled ${student.name} in: ${course.title}`);
      }
    }

    console.log("\n✨ Additional data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding additional data:", error);
    process.exit(1);
  }
}

seedAdditionalData(); 