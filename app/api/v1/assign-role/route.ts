import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export interface SetUserRoleFormData {
        role: "PATIENT" | "DOCTOR";
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
}

export async function POST(req: Request) {
        try {
                // 1. Auth check
                const { userId } = await auth();
                if (!userId) {
                        return NextResponse.json(
                                { success: false, message: "Unauthorized" },
                                { status: 401 }
                        );
                }

                // 2. Parse body
                const body: SetUserRoleFormData = await req.json();
                const { role } = body;

                if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
                        return NextResponse.json(
                                { success: false, message: "Invalid role selection" },
                                { status: 400 }
                        );
                }

                // 3. Find user
                const user = await db.user.findUnique({
                        where: { clerkUserId: userId },
                });

                if (!user) {
                        return NextResponse.json(
                                { success: false, message: "User not found" },
                                { status: 404 }
                        );
                }

                // 4. PATIENT role
                if (role === "PATIENT") {
                        await db.user.update({
                                where: { clerkUserId: userId },
                                data: {
                                        role: "PATIENT",
                                },
                        });

                        return NextResponse.json({
                                success: true,
                                redirect: "/doctors",
                        });
                }

                // 5. DOCTOR role
                if (role === "DOCTOR") {
                        const { specialty, experience, credentialUrl, description } = body;

                        if (!specialty || !experience || !credentialUrl || !description) {
                                return NextResponse.json(
                                        { success: false, message: "All fields are required" },
                                        { status: 400 }
                                );
                        }

                        await db.user.update({
                                where: { clerkUserId: userId },
                                data: {
                                        role: "DOCTOR",
                                        specialty,
                                        experience,
                                        credentialUrl,
                                        description,
                                        verificationStatus: "PENDING",
                                },
                        });

                        return NextResponse.json({
                                success: true,
                                redirect: "/doctor/verification",
                        });
                }

                // fallback
                return NextResponse.json(
                        { success: false, message: "Invalid role selection" },
                        { status: 400 }
                );
        } catch (error) {
                console.error("Failed to set user role:", error);

                return NextResponse.json(
                        {
                                success: false,
                                message:
                                        error instanceof Error
                                                ? error.message
                                                : "Failed to update user profile",
                        },
                        { status: 500 }
                );
        }
}
