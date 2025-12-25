"use server"

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export interface SetUserRoleFormData {
        role: "PATIENT" | "DOCTOR";
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
}
export interface UserRoleResponse {
        success: boolean;
        redirect: string;
}







/**
 * Gets the current user's complete profile information
 */
export async function getCurrentUser() {
        const { userId } = await auth();

        if (!userId) {
                return null;
        }

        try {
                const user = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                        },
                });

                return user;
        } catch (error) {
                console.error("Failed to get user information:", error);
                return null;
        }
}