"use client";

import React from 'react';
import Link from 'next/link';
import {
    Stethoscope,
    FlaskConical,
    UserCog,
    PawPrint,
    Building2,
    ShieldCheck,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const RoleCard = ({
    title,
    description,
    icon: Icon,
    href,
    colorClass,
    iconBg
}: {
    title: string;
    description: string;
    icon: any;
    href: string;
    colorClass: string;
    iconBg: string;
}) => (
    <Link
        href={href}
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl border border-gray-100 flex flex-col items-start active:bg-gray-50"
    >
        <div className={`absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${colorClass}`} />

        <div className={`mb-6 rounded-2xl p-4 shadow-sm ${iconBg}`}>
            <Icon className="h-8 w-8 text-white" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-500 leading-relaxed">{description}</p>

        <div className="mt-auto flex items-center gap-2 font-semibold text-primary-600 group-hover:gap-3 transition-all">
            <span>Get Started</span>
            <ChevronRight className="h-5 w-5" />
        </div>
    </Link>
);

export default function RoleGateway() {
    const { user } = useAuthStore();

    const getDashboardHref = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return '/admin/dashboard';
            case 'VET_DOCTOR': return '/vet/dashboard';
            case 'LAB_TECH': return '/lab/dashboard';
            case 'ACCOUNTANT': return '/finance/dashboard';
            case 'HR_MANAGER': return '/hr/dashboard';
            case 'CUSTOMER': return '/dashboard';
            default: return '/login';
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary-50/50 blur-3xl" />
                <div className="absolute top-[20%] -right-[10%] h-[30%] w-[30%] rounded-full bg-indigo-50/50 blur-3xl" />
                <div className="absolute bottom-[10%] left-[20%] h-[20%] w-[20%] rounded-full bg-rose-50/50 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-primary-700 font-semibold mb-6 animate-pulse">
                        <PawPrint className="h-5 w-5" />
                        <span>Welcome to the Future of Pet Care</span>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                        Everything you need for <span className="text-primary-600">VetCare</span> excellence.
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        A unified platform for clinics, laboratories, and pet owners. Choose your portal to begin.
                    </p>

                    {user && (
                        <div className="mt-8">
                            <Link
                                href={getDashboardHref(user.role)}
                                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                            >
                                Return to your Dashboard
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-2 text-sm text-gray-400">Logged in as {user.email}</p>
                        </div>
                    )}
                </div>

                {/* Roles Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <RoleCard
                        title="Veterinary Hub"
                        description="Manage patients, schedules, and telemedicine consultations with ease."
                        icon={Stethoscope}
                        href="/vet/dashboard"
                        colorClass="bg-blue-600"
                        iconBg="bg-blue-600"
                    />
                    <RoleCard
                        title="Laboratory Portal"
                        description="Track diagnostic orders, inventory reagents, and manage test results."
                        icon={FlaskConical}
                        href="/lab/dashboard"
                        colorClass="bg-teal-600"
                        iconBg="bg-teal-600"
                    />
                    <RoleCard
                        title="Business Center"
                        description="Control finances, invoices, and human resources in one place."
                        icon={Building2}
                        href="/finance/dashboard"
                        colorClass="bg-slate-700"
                        iconBg="bg-slate-700"
                    />
                    <RoleCard
                        title="Pet Owner Portal"
                        description="Book appointments, manage pet profiles, and view clinic invoices."
                        icon={PawPrint}
                        href="/dashboard"
                        colorClass="bg-rose-500"
                        iconBg="bg-rose-500"
                    />
                    <RoleCard
                        title="Platform Control"
                        description="System-wide management of branches, users, and security logs."
                        icon={ShieldCheck}
                        href="/admin/dashboard"
                        colorClass="bg-primary-600"
                        iconBg="bg-primary-600"
                    />
                    <div className="relative overflow-hidden rounded-3xl bg-gray-50 p-8 border border-dashed border-gray-300 flex flex-col justify-center items-center text-center opacity-75">
                        <UserCog className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">Need Support?</h3>
                        <p className="text-gray-500 text-sm">Contact our technical staff for help.</p>
                        <Link href="mailto:support@vetcare.com" className="mt-4 text-primary-600 font-semibold hover:underline">Support Center</Link>
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="py-12 border-t border-gray-100 mt-20 bg-gray-50/50">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">VetCare</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">© 2026 VetCare Technologies. Empowering Veterinary Professionals Worldwide.</p>
                </div>
            </div>
        </div>
    );
}
