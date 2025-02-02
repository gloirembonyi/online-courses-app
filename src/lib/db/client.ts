import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, courses, lessons, enrollments, subscriptions } from './schema';
import { eq, and } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';
import type { Course, Lesson, Subscription, User } from './types';

// Initialize Neon client
const sql = neon<boolean, boolean>(process.env.DATABASE_URL!);
const db = drizzle(sql);

export { db, sql };

// Database client functions
export const dbClient = {
  // User functions
  async createUser(email: string, password: string, name?: string) {
    const hashedPassword = await hash(password, 12);
    const [user] = await db.insert(users)
      .values({ email, hashedPassword, name })
      .returning();
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Course functions
  async createCourse(data: {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    authorId: string;
  }) {
    const [course] = await db.insert(courses).values(data).returning();
    return course;
  },

  async getCourses() {
    return await db.select().from(courses);
  },

  async getCourseById(id: string) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  },

  // Lesson functions
  async createLesson(data: {
    title: string;
    description: string;
    videoUrl: string;
    courseId: string;
    position: number;
  }) {
    const [lesson] = await db.insert(lessons).values(data).returning();
    return lesson;
  },

  async getLessonsByCourseId(courseId: string) {
    return await db.select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.position);
  },

  // Enrollment functions
  async enrollUserInCourse(userId: string, courseId: string) {
    const [enrollment] = await db.insert(enrollments)
      .values({ userId, courseId })
      .returning();
    return enrollment;
  },

  async isUserEnrolled(userId: string, courseId: string) {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
    return !!enrollment;
  },

  async getEnrolledCourses(userId: string) {
    const enrolledCourses = await db.select({
      course: courses
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId));
    
    return enrolledCourses.map(({ course }) => course);
  },

  // Subscription operations
  async createSubscription(data: {
    userId: string;
    status: string;
    startDate: Date;
    endDate: Date;
    priceId: string;
    price: string;
  }): Promise<Subscription[]> {
    return db.insert(subscriptions).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
  },

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const result = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.createdAt);
    return result[0];
  },
}; 