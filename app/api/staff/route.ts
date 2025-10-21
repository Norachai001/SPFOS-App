import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Handle GET requests to fetch all staff members.
 * @param {Request} request The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function GET(request: Request) {
  try {
    const staff = await prisma.staff.findMany();
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff data.' }, { status: 500 });
  }
}

/**
 * Handle POST requests to create a new staff member.
 * @param {Request} request The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function POST(request: Request) {
  try {
    const body: Prisma.StaffCreateInput = await request.json();

    // --- Validation ---
    if (!body.id || !body.name || !body.role || !body.avatarUrl) {
      return NextResponse.json({ error: 'Missing required fields: id, name, role, avatarUrl' }, { status: 400 });
    }

    const newStaff = await prisma.staff.create({
      data: body,
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    // Handle specific Prisma error for unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Staff with this ID or email already exists.' }, { status: 409 });
    }
    console.error('Failed to create staff:', error);
    return NextResponse.json({ error: 'Failed to create new staff member.' }, { status: 500 });
  }
}
