import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Handle GET requests to fetch all students.
 * Includes their transcripts for qualification checks.
 * @param {Request} request The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function GET(request: Request) {
  try {
    const students = await prisma.student.findMany({
      include: {
        transcript: true, // ดึงข้อมูล transcript ของแต่ละคนมาด้วย
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students data.' }, { status: 500 });
  }
}
