import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


/**
 * Handle GET requests to fetch a single staff member by ID.
 * @param {Request} request The incoming request object.
 * @param {{ params: { id: string } }} context The route parameters.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found.' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error(`Failed to fetch staff with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch staff data.' }, { status: 500 });
  }
}

