import { create } from "zustand";
import { User } from "@prisma/client";
import api from "@/request/request";
import { AxiosError } from "axios";


interface AuthStore {
        user: User | null;
        loading: boolean;
        error: string | null;
        checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
        user: null,
        loading: false,
        error: null,
        checkUser: async () => {
                set({ loading: true, error: null });
                try {
                        // Call your API with Axios
                        const res = await api.get("/auth/get-users"); // matches your Next.js route

                        set({ user: res.data, loading: false });
                } catch (err: unknown) {
                        console.error("Check user error:", err);
                        const axiosError = err as AxiosError;

                        if (axiosError.response) {
                                const message = (axiosError.response.data as { error?: string })?.error || "Something went wrong";
                                set({ user: null, loading: false, error: message });
                        } else if (axiosError.request) {
                                set({ user: null, loading: false, error: "No response from server" });
                        } else {
                                set({ user: null, loading: false, error: axiosError.message });
                        }
                }
        },
}));
