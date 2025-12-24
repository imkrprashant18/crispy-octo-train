import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export const runtime = "nodejs";

export async function GET(): Promise<Response> {
        try {
                const clerkUser = await currentUser();

                if (!clerkUser) {
                        return NextResponse.json(
                                { error: "Unauthorized" },
                                { status: 401 }
                        );
                }

                const monthStart = new Date();
                monthStart.setDate(1);
                monthStart.setHours(0, 0, 0, 0);

                /**
                 * Attempt to fetch user with latest credit transaction
                 */
                const user = await db.user.findUnique({
                        where: { clerkUserId: clerkUser.id },
                        select: {
                                id: true,
                                clerkUserId: true,
                                name: true,
                                email: true,
                                imageUrl: true,
                                createdAt: true,
                                transactions: {
                                        where: {
                                                type: "CREDIT_PURCHASE",
                                                createdAt: { gte: monthStart },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        take: 1,
                                },
                        },
                });

                if (user) {
                        return NextResponse.json(user, { status: 200 });
                }

                const name = [clerkUser.firstName, clerkUser.lastName]
                        .filter(Boolean)
                        .join(" ");

                const newUser = await db.user.create({
                        data: {
                                clerkUserId: clerkUser.id,
                                name,
                                email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                                imageUrl: clerkUser.imageUrl,
                                transactions: {
                                        create: {
                                                type: "CREDIT_PURCHASE",
                                                packageId: "free_user",
                                                amount: 2,
                                        },
                                },
                        },
                        select: {
                                id: true,
                                clerkUserId: true,
                                name: true,
                                email: true,
                                imageUrl: true,
                                createdAt: true,
                                transactions: true,
                        },
                });

                return NextResponse.json(newUser, { status: 201 });

        } catch (error) {
                console.error("[CHECK_USER_API_ERROR]", error);

                return NextResponse.json(
                        { error: "Internal server error" },
                        { status: 500 }
                );
        }
}
