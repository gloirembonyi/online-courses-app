import { NextResponse } from 'next/server';
import { dbClient } from '@/lib/db/client';
import { uploadFile } from '@/lib/uploadFile';

export async function GET() {
  try {
    const courses = await dbClient.getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get admin user first
    const adminUser = await dbClient.getUserByEmail("admin@example.com");
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found. Please run the create-admin script first.' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const thumbnail = formData.get('thumbnail') as File;

    if (!title || !description || !price || !thumbnail) {
      return NextResponse.json(
        { error: 'Missing required course fields' },
        { status: 400 }
      );
    }

    // Upload thumbnail
    const thumbnailUrl = await uploadFile(thumbnail, 'image');

    // Create course with admin user ID
    const course = await dbClient.createCourse({
      title,
      description,
      imageUrl: thumbnailUrl,
      videoUrl: '', // Main course video is optional now
      price,
      authorId: adminUser.id, // Use admin user ID instead of "system"
    });

    // Process lessons
    const lessons = [];
    let index = 0;
    while (formData.has(`lessons[${index}][title]`)) {
      const lessonTitle = formData.get(`lessons[${index}][title]`) as string;
      const lessonDescription = formData.get(
        `lessons[${index}][description]`
      ) as string;
      const lessonVideo = formData.get(`lessons[${index}][video]`) as File;
      const position = parseInt(
        formData.get(`lessons[${index}][position]`) as string
      );

      if (!lessonTitle || !lessonDescription || !lessonVideo) {
        return NextResponse.json(
          { error: `Missing required fields for lesson ${index + 1}` },
          { status: 400 }
        );
      }

      // Upload lesson video
      const videoUrl = await uploadFile(lessonVideo, 'video');

      // Create lesson
      const lesson = await dbClient.createLesson({
        title: lessonTitle,
        description: lessonDescription,
        videoUrl,
        courseId: course.id,
        position,
      });

      lessons.push(lesson);
      index++;
    }

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        lessons,
      },
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 