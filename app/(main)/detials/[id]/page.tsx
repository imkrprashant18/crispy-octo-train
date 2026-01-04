"use client";

import { PageHeader } from "@/components/page-header";
import { useDoctorById } from "@/request/doctors";

import { useParams } from "next/navigation";

import { DoctorProfile } from "../_components/doctor-profile";
import { getDoctorById } from "@/actions/appointment";
import { useEffect, useState } from "react";

export default function DoctorProfilePage() {
        const params = useParams();


        const [doctor, setDoctor] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                async function fetchDoctor() {
                        try {
                                const result = await getDoctorById(String(params?.id));
                                setDoctor(result.doctor);
                        } catch (err) {
                                setError("Failed to fetch doctor");
                        } finally {
                                setLoading(false);
                        }
                }

                fetchDoctor();
        }, [params?.id]);
        console.log(doctor)







        return (
                <div className="container mx-auto py-8">
                        <PageHeader
                                title={doctor.name}
                                backLink="/doctors"
                                backLabel="Back to Doctors"
                        />

                        <div className="mt-6">
                                <DoctorProfile doctor={doctor} />
                        </div>
                </div>
        );
}
