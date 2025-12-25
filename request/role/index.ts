"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../request";

export interface SetUserRoleFormData {
        role: "PATIENT" | "DOCTOR" | string;
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
}

interface UserRoleResponse {
        success: boolean;
        redirect: string;
        message?: string;
}

export function useSetUserRole() {
        return useMutation<UserRoleResponse, Error, SetUserRoleFormData>({
                mutationFn: async (payload) => {
                        const res = await api.post("/assign-role", payload, {
                                headers: { "Content-Type": "application/json" },
                                withCredentials: true,
                        });
                        return res.data;
                },
        });
}
