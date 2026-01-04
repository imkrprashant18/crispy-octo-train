import { NextResponse } from "next/server";
import db from "@/lib/prisma";

// GET /api/v1/doctors/:id
export async function GET(
        request: Request,
        { params }: { params: { id: string } }
) {
        const doctorId = params.id;

        if (!doctorId) {
                return NextResponse.json(
                        { error: "Doctor ID is required" },
                        { status: 400 }
                );
        }

        try {
                const doctor = await db.user.findUnique({
                        where: { id: doctorId },
                        // Ensure we only fetch doctors who are verified
                        // If role and verificationStatus are fields in user table
                        // Note: findUnique only allows unique constraints (id), so filtering role/status must be done differently
                });

                if (!doctor || doctor.role !== "DOCTOR" || doctor.verificationStatus !== "VERIFIED") {
                        return NextResponse.json(
                                { error: "Doctor not found or not verified" },
                                { status: 404 }
                        );
                }

                return NextResponse.json({ doctor });
        } catch (error) {
                console.error("Failed to fetch doctor:", error);
                return NextResponse.json(
                        { error: "Failed to fetch doctor details" },
                        { status: 500 }
                );
        }
}
