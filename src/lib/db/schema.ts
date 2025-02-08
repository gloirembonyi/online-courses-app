import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password"),
  name: text("name"),
  image: text("image"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  authorId: text("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  courseId: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  token: text("token").notNull(),
  used: boolean("used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  priceId: text("price_id").notNull(),
  price: decimal("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseRatings = pgTable("course_ratings", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseComments = pgTable(
  "course_comments",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    courseId: text("course_id")
      .references(() => courses.id, { onDelete: "cascade" })
      .notNull(),
    lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    parentId: text("parent_id").references((): any => courseComments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const lessonProgress = pgTable("lesson_progress", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  lessonId: text("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").default(false).notNull(),
  progressPercentage: integer("progress_percentage").default(0).notNull(),
  lastWatchedPosition: integer("last_watched_position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type CourseRating = typeof courseRatings.$inferSelect;
export type CourseComment = typeof courseComments.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect; 