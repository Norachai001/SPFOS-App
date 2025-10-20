import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import prisma instance ที่สร้างไว้

/**
 * Handles GET requests to fetch all privileges.
 * @param request - The incoming request object.
 * @returns A JSON response with the list of privileges or an error.
 */
export async function GET(request: Request) {
  try {
    // ใช้ Prisma Client เพื่อดึงข้อมูล privileges ทั้งหมดจากฐานข้อมูล
    const privileges = await prisma.privilege.findMany();
    // ส่งข้อมูลกลับไปเป็น JSON
    return NextResponse.json(privileges);
  } catch (error) {
    console.error("Failed to fetch privileges:", error);
    // ในกรณีที่เกิดข้อผิดพลาด, ส่ง error response กลับไป
    return NextResponse.json({ message: "Failed to fetch privileges." }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new privilege.
 * @param request - The incoming request object containing the new privilege data.
 * @returns A JSON response with the newly created privilege or an error.
 */
export async function POST(request: Request) {
  try {
    // อ่านข้อมูล JSON ที่ส่งมาจาก client
    const body = await request.json();
    const { title, description, reward, type, criteria } = body;

    // --- (Validation) ตรวจสอบข้อมูลเบื้องต้น ---
    if (!title || !description || !reward || !type) {
      return NextResponse.json({ message: "Missing required fields: title, description, reward, type." }, { status: 400 });
    }

    // สร้างข้อมูลใหม่ในฐานข้อมูลโดยใช้ Prisma Client
    const newPrivilege = await prisma.privilege.create({
      data: {
        title,
        description,
        reward,
        type,
        // map ข้อมูล criteria ที่รับมาจาก client ไปยัง fields ใน database schema
        criteriaGpax: criteria?.gpax,
        criteriaStudyYearMin: criteria?.studyYear?.min,
        criteriaStudyYearMax: criteria?.studyYear?.max,
        criteriaRequiredCourses: criteria?.requiredCourses,
        criteriaSpecificCourseId: criteria?.specificCourseGrade?.courseId,
        criteriaSpecificCourseGrade: criteria?.specificCourseGrade?.grade,
      },
    });

    // ส่งข้อมูลที่สร้างใหม่กลับไป พร้อม status 201 Created
    return NextResponse.json(newPrivilege, { status: 201 });

  } catch (error) {
    console.error("Failed to create privilege:", error);
    // ในกรณีที่เกิดข้อผิดพลาด, ส่ง error response กลับไป
    // อาจจะเป็นเพราะข้อมูลไม่ถูกต้องตาม format หรือ database error
    return NextResponse.json({ message: "Failed to create privilege." }, { status: 500 });
  }
}

