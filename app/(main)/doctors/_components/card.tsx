"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Doctor {
        id: string;
        name: string;
        email: string;
        specialty: string;
        experience: number;
        imageUrl: string;
}

interface DoctorCardProps {
        doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
        return (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
                        {/* Profile Image */}
                        <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20">
                                        <Image
                                                src={doctor.imageUrl}
                                                alt={doctor.name}
                                                fill
                                                className="object-cover"
                                        />
                                </div>

                                <div>
                                        <h3 className="text-lg font-semibold text-white">
                                                {doctor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                                {doctor.specialty}
                                        </p>
                                </div>
                        </div>

                        {/* Info */}
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                <p>📧 {doctor.email}</p>
                                <p>🩺 {doctor.experience} years experience</p>
                        </div>

                        {/* Action */}
                        <Button
                                asChild
                                className="w-full bg-amber-500 hover:bg-amber-600 mt-2"
                        >
                                <Link href={`/detials/${doctor.id}`}>
                                        <Calendar className="h-4 w-4 mr-2" />
                                        View Profile & Book
                                </Link>
                        </Button>
                </div>
        );
};
