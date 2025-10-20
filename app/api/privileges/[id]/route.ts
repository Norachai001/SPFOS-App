import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { id: string };
}

/**
 * Handles GET requests to fetch a single privilege by its ID.
 * @param request - The incoming request object.
 * @param params - The route parameters containing the privilege ID.
 * @returns A JSON response with the privilege data or an error.
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const id = params.id;
    const privilegeId = parseInt(id, 10);

    // ตรวจสอบว่า ID ที่ได้มาเป็นตัวเลขที่ถูกต้องหรือไม่
    if (isNaN(privilegeId)) {
      return NextResponse.json({ message: 'Invalid ID format.' }, { status: 400 });
    }

    const privilege = await prisma.privilege.findUnique({
      where: { id: privilegeId },
    });

    // ถ้าไม่พบข้อมูล, ส่ง 404 Not Found
    if (!privilege) {
      return NextResponse.json({ message: 'Privilege not found.' }, { status: 404 });
    }

    return NextResponse.json(privilege);
  } catch (error) {
    console.error(`Failed to fetch privilege with ID: ${params.id}`, error);
    return NextResponse.json({ message: 'Failed to fetch privilege.' }, { status: 500 });
  }
}

/**
 * Handles PUT requests to update an existing privilege.
 * @param request - The incoming request object with the update data.
 * @param params - The route parameters containing the privilege ID.
 * @returns A JSON response with the updated privilege data or an error.
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = params.id;
    const privilegeId = parseInt(id, 10);

    if (isNaN(privilegeId)) {
      return NextResponse.json({ message: 'Invalid ID format.' }, { status: 400 });
    }
    
    const body = await request.json();
    const { title, description, reward, type, criteria } = body;

    // (Validation) ตรวจสอบข้อมูลเบื้องต้น
    if (!title || !description || !reward || !type) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const updatedPrivilege = await prisma.privilege.update({
      where: { id: privilegeId },
      data: {
        title,
        description,
        reward,
        type,
        criteriaGpax: criteria?.gpax,
        criteriaStudyYearMin: criteria?.studyYear?.min,
        criteriaStudyYearMax: criteria?.studyYear?.max,
        criteriaRequiredCourses: criteria?.requiredCourses,
        criteriaSpecificCourseId: criteria?.specificCourseGrade?.courseId,
        criteriaSpecificCourseGrade: criteria?.specificCourseGrade?.grade,
      },
    });

    return NextResponse.json(updatedPrivilege);
  } catch (error: any) {
    // ดักจับ error กรณีที่หา ID ที่ต้องการอัปเดตไม่เจอ
    if (error.code === 'P2025') {
       return NextResponse.json({ message: 'Privilege not found.' }, { status: 404 });
    }
    console.error(`Failed to update privilege with ID: ${params.id}`, error);
    return NextResponse.json({ message: 'Failed to update privilege.' }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to remove a privilege.
 * @param request - The incoming request object.
 * @param params - The route parameters containing the privilege ID.
 * @returns A response indicating success or failure.
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = params.id;
    const privilegeId = parseInt(id, 10);

    if (isNaN(privilegeId)) {
      return NextResponse.json({ message: 'Invalid ID format.' }, { status: 400 });
    }

    await prisma.privilege.delete({
      where: { id: privilegeId },
    });

    // ส่ง status 204 No Content เพื่อบอกว่าลบสำเร็จแล้วและไม่มีข้อมูลจะส่งกลับไป
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    // ดักจับ error กรณีที่หา ID ที่ต้องการลบไม่เจอ
    if (error.code === 'P2025') {
       return NextResponse.json({ message: 'Privilege not found.' }, { status: 404 });
    }
    console.error(`Failed to delete privilege with ID: ${params.id}`, error);
    return NextResponse.json({ message: 'Failed to delete privilege.' }, { status: 500 });
  }
}
