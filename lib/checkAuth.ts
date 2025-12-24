import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import db from "./prisma";


export const checkUser = async () => {
        try {
                const user = await currentUser();
                if (!user) return null;

                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);


                return await db.user.upsert({
                        where: { clerkUserId: user.id },
                        update: {
                                imageUrl: user.imageUrl,
                                name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
                        },
                        create: {
                                clerkUserId: user.id,
                                name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
                                imageUrl: user.imageUrl,
                                email: user.emailAddresses[0].emailAddress,
                                transactions: {
                                        create: {
                                                type: "CREDIT_PURCHASE",
                                                packageId: "free_user",
                                                amount: 2,
                                        },
                                },
                        },
                        include: {
                                transactions: {
                                        where: {
                                                type: "CREDIT_PURCHASE",
                                                createdAt: { gte: startOfMonth },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        take: 1,
                                },
                        },
                });
        } catch (error) {

                console.error("[CHECK_USER_ERROR]:", error);
                return null;
        }
};
