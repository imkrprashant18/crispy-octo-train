"use client";

import { useParams } from "next/navigation";
import { useGetDoctorsList } from "@/request/doctors";
import { PageHeader } from "@/components/page-header";
import { DoctorCard } from "../_components/card";



const Page = () => {
        const params = useParams();
        const specialty = params.speciality as string;
        const { data, error, isLoading } = useGetDoctorsList(specialty);

        if (!specialty) {
                return (
                        <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-white mb-2">
                                        No specialty selected
                                </h3>
                                <p className="text-muted-foreground">
                                        Please select a specialty to view available doctors.
                                </p>
                        </div>
                );
        }

        if (isLoading) {
                return (
                        <div className="text-center py-12 text-white">
                                Loading doctors...
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="text-center py-12 text-red-500">
                                Failed to load doctors
                        </div>
                );
        }

        const doctors = data?.doctors ?? [];


        return (
                <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
                        <PageHeader
                                title={decodeURIComponent(specialty)}
                                backLink="/doctors"
                                backLabel="All Specialties"
                        />

                        {doctors.length === 0 ? (
                                <p className="text-center text-muted-foreground">
                                        No doctors found for this specialty.
                                </p>
                        ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {doctors.map((doctor) => (
                                                <DoctorCard key={doctor.id} doctor={doctor} />
                                        ))}
                                </div>
                        )}
                </div>
        );
};

export default Page;
