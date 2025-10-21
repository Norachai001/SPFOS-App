import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define the expected shape of the params object for clarity
interface RouteParams {
  params: { id: string };
}

/**
 * Handle GET requests to fetch a single privilege by ID.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid privilege ID.' }, { status: 400 });
    }

    const privilege = await prisma.privilege.findUnique({
      where: { id },
    });

    if (!privilege) {
      return NextResponse.json({ error: 'Privilege not found.' }, { status: 404 });
    }

    return NextResponse.json(privilege);
  } catch (error) {
    console.error(`Failed to fetch privilege with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch privilege data.' }, { status: 500 });
  }
}

/**
 * Handle PUT requests to update a privilege by ID.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid privilege ID.' }, { status: 400 });
    }

    const data = await request.json();
    const { title, description, reward, criteria } = data;

    // Basic validation
    if (!title || !description || !reward) {
      return NextResponse.json({ error: 'Title, description, and reward are required.' }, { status: 400 });
    }

    // By removing the explicit type annotation, we let TypeScript infer the type,
    // which resolves the complex union type issue with Prisma.
    const updateData = {
      title,
      description,
      reward,
      type: data.type, // Assuming type is also sent
      criteria: criteria as Prisma.JsonValue,
    };

    const updatedPrivilege = await prisma.privilege.update({
      where: { id },
      data: updateData, // Pass the inferred object
    });

    return NextResponse.json(updatedPrivilege);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: `Privilege with id ${params.id} not found.` }, { status: 404 });
    }
    console.error(`Failed to update privilege with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update privilege.' }, { status: 500 });
  }
}

/**
 * Handle DELETE requests to remove a privilege by ID.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid privilege ID.' }, { status: 400 });
    }

    await prisma.privilege.delete({
      where: { id },
    });

    // Return a 204 No Content response for successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: `Privilege with id ${params.id} not found.` }, { status: 404 });
    }
    console.error(`Failed to delete privilege with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete privilege.' }, { status: 500 });
  }
}

