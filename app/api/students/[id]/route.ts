import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { id: string };
}

/**
 * Handles GET requests to fetch a single student by their ID, including their transcript.
 * @param request - The incoming request object.
 * @param params - The route parameters containing the student ID.
 * @returns A JSON response with the student data or an error.
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const id = params.id;

    // ตรวจสอบว่ามี ID ส่งมาหรือไม่
    if (!id) {
      return NextResponse.json({ message: 'Student ID is required.' }, { status: 400 });
    }

    // ใช้ Prisma Client เพื่อดึงข้อมูลนิสิตตาม ID ที่ระบุ
    // ใช้ `include` เพื่อดึงข้อมูล `transcript` ที่มีความสัมพันธ์กันมาด้วย
    const student = await prisma.student.findUnique({
      where: { id: id },
      include: {
        transcript: true, // ดึงข้อมูล Transcript ทั้งหมดของนิสิตคนนี้
      },
    });

    // ถ้าไม่พบข้อมูลนิสิต, ส่ง 404 Not Found
    if (!student) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    // ส่งข้อมูลนิสิตที่พบกลับไปเป็น JSON
    return NextResponse.json(student);

  } catch (error) {
    console.error(`Failed to fetch student with ID: ${params.id}`, error);
    // ในกรณีที่เกิดข้อผิดพลาด, ส่ง error response กลับไป
    return NextResponse.json({ message: 'Failed to fetch student.' }, { status: 500 });
  }
}
