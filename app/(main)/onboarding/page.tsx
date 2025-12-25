"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
        Card,
        CardContent,
        CardDescription,
        CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";

import { doctorFormSchema } from "@/lib/validation-schema";
import { SPECIALTIES } from "@/lib/specialist";
import { useSetUserRole } from "@/request/role";


// ---------------- Types ----------------
interface DoctorFormData {
        specialty: string;
        experience: number;
        credentialUrl: string;
        description: string;
}

// ---------------- Component ----------------
export default function OnboardingPage() {
        const [step, setStep] = useState<"choose-role" | "doctor-form">("choose-role");
        const router = useRouter();

        // ✅ TanStack Query mutation
        const { mutateAsync, isPending, data, error } = useSetUserRole();
        const loading = isPending;

        // ---------------- Form ----------------
        const {
                register,
                handleSubmit,
                formState: { errors },
                setValue,
                watch,
        } = useForm<DoctorFormData>({
                resolver: zodResolver(doctorFormSchema),
                defaultValues: {
                        specialty: "",
                        experience: 0,
                        credentialUrl: "",
                        description: "",
                },
        });

        const specialtyValue = watch("specialty");

        // ---------------- API CALLS ----------------
        const handlePatientSelection = async () => {
                if (loading) return;
                await mutateAsync({ role: "PATIENT" });
        };

        const onDoctorSubmit = async (formData: DoctorFormData) => {
                if (loading) return;

                await mutateAsync({
                        role: "DOCTOR",
                        specialty: formData.specialty,
                        experience: formData.experience,
                        credentialUrl: formData.credentialUrl,
                        description: formData.description,
                });
        };

        // ---------------- Effects ----------------
        useEffect(() => {
                if (data?.success) {
                        router.push(data.redirect);
                }
        }, [data, router]);

        useEffect(() => {
                if (error) {
                        alert(error.message);
                }
        }, [error]);

        // ---------------- UI ----------------
        if (step === "choose-role") {
                return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* PATIENT */}
                                <Card
                                        className="cursor-pointer bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-900/30"
                                        onClick={handlePatientSelection}
                                >
                                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                                <div className="p-4 bg-amber-900/20 rounded-full mb-4">
                                                        <User className="h-8 w-8 text-amber-400" />
                                                </div>
                                                <CardTitle className="text-white">Join as a Patient</CardTitle>
                                                <CardDescription className="mb-4">
                                                        Book appointments and manage your healthcare journey
                                                </CardDescription>

                                                <Button className="w-full bg-amber-600" disabled={loading}>
                                                        {loading ? (
                                                                <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Processing...
                                                                </>
                                                        ) : (
                                                                "Continue as Patient"
                                                        )}
                                                </Button>
                                        </CardContent>
                                </Card>

                                {/* DOCTOR */}
                                <Card
                                        className="cursor-pointer bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-900/30"
                                        onClick={() => !loading && setStep("doctor-form")}
                                >
                                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                                <div className="p-4 bg-amber-900/20 rounded-full mb-4">
                                                        <Stethoscope className="h-8 w-8 text-amber-400" />
                                                </div>
                                                <CardTitle className="text-white">Join as a Doctor</CardTitle>
                                                <CardDescription className="mb-4">
                                                        Create your professional profile
                                                </CardDescription>

                                                <Button className="w-full bg-amber-600" disabled={loading}>
                                                        Continue as Doctor
                                                </Button>
                                        </CardContent>
                                </Card>
                        </div>
                );
        }

        // ---------------- Doctor Form ----------------
        return (
                <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border border-amber-200">
                        <CardContent className="pt-6">
                                <CardTitle className="text-white mb-4">
                                        Complete Your Doctor Profile
                                </CardTitle>

                                <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
                                        {/* Specialty */}
                                        <div>
                                                <Label>Medical Specialty</Label>
                                                <Select
                                                        value={specialtyValue}
                                                        onValueChange={(v) => setValue("specialty", v)}
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Select specialty" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {SPECIALTIES.map((spec) => (
                                                                        <SelectItem key={spec.name} value={spec.name}>
                                                                                {spec.name}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                {errors.specialty && (
                                                        <p className="text-red-500 text-sm">
                                                                {errors.specialty.message}
                                                        </p>
                                                )}
                                        </div>

                                        {/* Experience */}
                                        <div>
                                                <Label>Years of Experience</Label>
                                                <Input
                                                        type="number"
                                                        {...register("experience", { valueAsNumber: true })}
                                                />
                                        </div>

                                        {/* Credential */}
                                        <div>
                                                <Label>Credential URL</Label>
                                                <Input type="url" {...register("credentialUrl")} />
                                        </div>

                                        {/* Description */}
                                        <div>
                                                <Label>Description</Label>
                                                <Textarea rows={4} {...register("description")} />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between">
                                                <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setStep("choose-role")}
                                                        disabled={loading}
                                                >
                                                        Back
                                                </Button>

                                                <Button type="submit" disabled={loading} className="bg-amber-600">
                                                        {loading ? (
                                                                <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Submitting...
                                                                </>
                                                        ) : (
                                                                "Submit for Verification"
                                                        )}
                                                </Button>
                                        </div>
                                </form>
                        </CardContent>
                </Card>
        );
}
