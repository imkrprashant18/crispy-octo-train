
import { NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
        try {
                const { userId } = await auth();
                if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                const user = await db.user.findUnique({
                        where: { clerkUserId: userId },
                });
                const isAdmin = user?.role === "ADMIN";
                if (!isAdmin) {
                        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }

                // Optional: handle query params for pagination
                const url = new URL(request.url);
                const skip = Number(url.searchParams.get('skip') || 0);
                const take = Number(url.searchParams.get('take') || 50);

                const doctors = await db.user.findMany({
                        where: {
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                        },
                        orderBy: {
                                name: "asc",
                        },
                        select: {
                                id: true,
                                name: true,
                                email: true,
                                specialization: true, // include if you want
                        },
                        skip,
                        take,
                });

                return NextResponse.json({ doctors });
        } catch (error) {
                console.error("Failed to get verified doctors:", error);
                return NextResponse.json({ error: "Failed to fetch verified doctors" }, { status: 500 });
        }
}
