"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../request";

export interface Doctor {
        id: string;
        name: string;
        email: string;
        specialty: string;
        experience: number;
        imageUrl: string;
}

interface DoctorsResponse {
        doctors: Doctor[];
}

interface UseVerifiedDoctorsOptions {
        skip?: number;
        take?: number;
}

export function useVerifiedDoctors({ skip = 0, take = 50 }: UseVerifiedDoctorsOptions = {}) {
        return useQuery<DoctorsResponse, Error>({
                queryKey: ["verified-doctors", skip, take],
                queryFn: async () => {
                        const res = await api.get<DoctorsResponse>(`/verified-doctors?skip=${skip}&take=${take}`, {
                                withCredentials: true,
                        });
                        return res.data;
                },
        });
}


export function useGetDoctorsList(specialty: string) {
        return useQuery<DoctorsResponse, Error>({
                queryKey: ["doctors-list", specialty],
                queryFn: async () => {
                        const res = await api.get<DoctorsResponse>(`/doctors/by-speciality?specialty=${specialty}`, {
                                withCredentials: true,
                        });
                        return res.data;
                },
        });
}
export function useDoctorById(doctorId: string) {
        return useQuery<DoctorsResponse, Error>({
                queryKey: ["doctor", doctorId],
                queryFn: async () => {
                        if (!doctorId) throw new Error("Doctor ID is required");

                        const res = await api.get<DoctorsResponse>(`/doctors/${doctorId}`, {
                                withCredentials: true, // only needed if your API requires cookies
                        });

                        return res.data;
                },
                enabled: !!doctorId, // ensures the query only runs if doctorId exists
        });
}

