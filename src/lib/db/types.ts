export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
  image: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  courseId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
} 