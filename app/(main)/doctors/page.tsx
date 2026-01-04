"use client"

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialist";



export default function DoctorsPage() {
        return (
                <div className="w-full px-12 py-6 min-h-screen bg-gray-900">
                        <div className="flex flex-col items-center justify-center mb-8 text-center">
                                <h1 className="text-3xl font-bold text-white mb-2">Find Your Doctor</h1>
                                <p className="text-muted-foreground text-lg">
                                        Browse by specialty or view all available healthcare providers
                                </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {SPECIALTIES.map((specialty) => {
                                        const Icon = specialty.icon; // Get icon component
                                        return (
                                                <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
                                                        <Card className="hover:border-amber-700/40 transition-all cursor-pointer border-amber-900/20 h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
                                                                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                                                        <div className="w-12 h-12 rounded-full bg-amber-900/20 flex items-center justify-center mb-4">
                                                                                <Icon className="text-amber-400 w-6 h-6" />
                                                                        </div>
                                                                        <h3 className="font-medium text-white">{specialty.name}</h3>
                                                                </CardContent>
                                                        </Card>
                                                </Link>
                                        );
                                })}
                        </div>
                </div>
        );
}