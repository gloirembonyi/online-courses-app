import { db } from "@/lib/db";
import { users, courses, lessons, enrollments, courseRatings, courseComments, lessonProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Sample review templates
const reviewTemplates = [
  "Great course! The content is well-structured and easy to follow.",
  "Very informative and practical. The instructor explains concepts clearly.",
  "Excellent course material. I learned a lot and enjoyed the hands-on projects.",
  "Good course, but some sections could be more detailed.",
  "The course exceeded my expectations. Highly recommended!",
];

// Sample comment templates
const commentTemplates = [
  "Thanks for explaining this concept so clearly!",
  "Could you provide more examples for this topic?",
  "This lesson was particularly helpful.",
  "Great explanation of a complex topic.",
  "I'm having trouble with this part. Any additional resources?",
];

async function seedEngagementData() {
  try {
    console.log("🌱 Seeding engagement data...\n");

    // Get all students and their enrollments
    const students = await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, false));

    for (const student of students) {
      console.log(`\nProcessing engagement data for ${student.name}...`);
      
      // Get student's enrolled courses
      const enrolledCourses = await db
        .select({
          course: courses
        })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(eq(enrollments.userId, student.id));

      // Add ratings and reviews for enrolled courses
      for (const { course } of enrolledCourses) {
        // Add course rating (4 or 5 stars)
        const rating = 4 + Math.floor(Math.random() * 2);
        const review = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        
        await db.insert(courseRatings).values({
          userId: student.id,
          courseId: course.id,
          rating,
          review
        });
        console.log(`✅ Added ${rating}-star rating for: ${course.title}`);

        // Get course lessons
        const courseLessons = await db
          .select()
          .from(lessons)
          .where(eq(lessons.courseId, course.id))
          .orderBy(lessons.position);

        // Add progress for each lesson
        for (const lesson of courseLessons) {
          const progress = Math.floor(Math.random() * 101); // 0-100
          const completed = progress === 100;
          const lastWatchedPosition = Math.floor(progress * 300); // Assuming 5-minute lessons (300 seconds)

          await db.insert(lessonProgress).values({
            userId: student.id,
            lessonId: lesson.id,
            completed,
            progressPercentage: progress,
            lastWatchedPosition
          });

          // Add a comment with 30% probability
          if (Math.random() < 0.3) {
            const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
            await db.insert(courseComments).values({
              userId: student.id,
              courseId: course.id,
              lessonId: lesson.id,
              content: comment
            });
            console.log(`✅ Added comment for lesson: ${lesson.title}`);
          }
        }
        console.log(`✅ Added progress data for course: ${course.title}`);
      }
    }

    console.log("\n✨ Engagement data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding engagement data:", error);
    process.exit(1);
  }
}

seedEngagementData(); 