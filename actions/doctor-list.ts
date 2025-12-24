"use server"



import db from "@/lib/prisma";
import type { User } from "@prisma/client";

interface GetDoctorsBySpecialtyResult {
        doctors?: User[];
        error?: string;
}

export async function getDoctorsBySpecialty(specialty: string): Promise<GetDoctorsBySpecialtyResult> {
        try {


                const doctors = await db.user.findMany({
                        where: {
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                                specialty: specialty,
                        },
                        orderBy: {
                                name: "asc",
                        },
                });

                return { doctors };
        } catch (error) {
                console.error("Failed to fetch doctors by specialty:", error);
                return { error: "Failed to fetch doctors" };
        }
}