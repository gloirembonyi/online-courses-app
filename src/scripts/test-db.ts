import { db } from "@/lib/db";
import { users, courses, lessons, enrollments, courseRatings, courseComments, lessonProgress } from "@/lib/db/schema";
import { eq, and, avg } from "drizzle-orm";

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...\n");

    // Test 1: Check admin user
    console.log("Test 1: Checking admin user...");
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@example.com"));
    
    if (adminUser) {
      console.log("✅ Admin user found");
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Is Admin: ${adminUser.isAdmin}`);
    } else {
      console.log("❌ Admin user not found");
    }

    // Test 2: Check student users
    console.log("\nTest 2: Checking student users...");
    const studentUsers = await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, false));
    console.log(`✅ Found ${studentUsers.length} students`);
    for (const student of studentUsers) {
      console.log(`   👤 ${student.name} (${student.email})`);
    }

    // Test 3: Check courses and their lessons
    console.log("\nTest 3: Checking courses and lessons...");
    const allCourses = await db.select().from(courses);
    console.log(`✅ Found ${allCourses.length} courses`);
    
    for (const course of allCourses) {
      console.log(`\n📚 Course: ${course.title}`);
      console.log(`   Price: $${course.price}`);
      
      // Get course ratings
      const [avgRating] = await db
        .select({ avg: avg(courseRatings.rating).mapWith(Number) })
        .from(courseRatings)
        .where(eq(courseRatings.courseId, course.id));
      
      const ratings = await db
        .select()
        .from(courseRatings)
        .where(eq(courseRatings.courseId, course.id));

      console.log(`   ⭐ Average Rating: ${avgRating.avg?.toFixed(1) || 'No ratings'} (${ratings.length} reviews)`);
      
      // Get lessons and their progress
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(lessons.position);
      
      console.log(`   📖 Lessons: ${courseLessons.length}`);
      for (const lesson of courseLessons) {
        console.log(`      ${lesson.position}. ${lesson.title}`);
        
        // Get comments for this lesson
        const lessonComments = await db
          .select({
            comment: courseComments,
            user: users
          })
          .from(courseComments)
          .innerJoin(users, eq(courseComments.userId, users.id))
          .where(eq(courseComments.lessonId, lesson.id));

        if (lessonComments.length > 0) {
          console.log(`         💬 ${lessonComments.length} comments`);
          for (const { comment, user } of lessonComments) {
            console.log(`            - ${user.name}: "${comment.content}"`);
          }
        }
      }
    }

    // Test 4: Check student progress
    console.log("\nTest 4: Checking student progress...");
    for (const student of studentUsers) {
      const enrolledCourses = await db
        .select({
          course: courses
        })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(eq(enrollments.userId, student.id));

      console.log(`\n👤 ${student.name}'s progress:`);
      
      for (const { course } of enrolledCourses) {
        // Get course lessons
        const courseLessons = await db
          .select()
          .from(lessons)
          .where(eq(lessons.courseId, course.id));

        // Get progress for all lessons
        const lessonProgressData = await db
          .select({
            lesson: lessons,
            progress: lessonProgress
          })
          .from(lessons)
          .where(eq(lessons.courseId, course.id))
          .leftJoin(
            lessonProgress,
            and(
              eq(lessonProgress.lessonId, lessons.id),
              eq(lessonProgress.userId, student.id)
            )
          );

        const totalLessons = lessonProgressData.length;
        const totalProgress = lessonProgressData.reduce((sum, { progress }) => 
          sum + (progress?.progressPercentage || 0), 0
        );
        const averageProgress = totalLessons > 0 ? totalProgress / totalLessons : 0;
        const completedLessons = lessonProgressData.filter(({ progress }) => 
          progress?.progressPercentage === 100
        ).length;

        console.log(`   📚 ${course.title}:`);
        console.log(`      Progress: ${averageProgress.toFixed(1)}% (${completedLessons}/${totalLessons} lessons completed)`);
        
        // Show individual lesson progress
        for (const { lesson, progress } of lessonProgressData) {
          console.log(`         - ${lesson.title}: ${progress?.progressPercentage || 0}%`);
        }
      }
    }

    console.log("\n✨ All database tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error testing database:", error);
    process.exit(1);
  }
}

testDatabase(); 