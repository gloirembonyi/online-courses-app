import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbClient } from '@/lib/db/client';

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
    const session = await auth();
    if (!session?.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const thumbnail = formData.get('thumbnail') as File;
    const video = formData.get('video') as File;

    if (!title || !description || !price || !thumbnail || !video) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Upload files to a storage service (e.g., AWS S3, Cloudinary)
    // For now, we'll just store the file names
    const thumbnailUrl = `/uploads/${thumbnail.name}`;
    const videoUrl = `/uploads/${video.name}`;

    const course = await dbClient.createCourse({
      title,
      description,
      price,
      imageUrl: thumbnailUrl,
      authorId: session.user.id,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 