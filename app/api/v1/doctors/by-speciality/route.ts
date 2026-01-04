import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(request: Request) {
        try {
                const { searchParams } = new URL(request.url);
                const specialty = searchParams.get("specialty");

                if (!specialty) {
                        return NextResponse.json(
                                { error: "Specialty is required" },
                                { status: 400 }
                        );
                }

                const doctors = await db.user.findMany({
                        where: {
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                                specialty: specialty,
                        },
                        orderBy: {
                                name: "asc",
                        },
                        select: {
                                id: true,
                                name: true,
                                email: true,
                                specialty: true,
                                imageUrl: true,
                                experience: true,
                        },
                });

                return NextResponse.json({ doctors }, { status: 200 });
        } catch (error) {
                console.error("Failed to fetch doctors:", error);
                return NextResponse.json(
                        { error: "Failed to fetch doctors" },
                        { status: 500 }
                );
        }
}
