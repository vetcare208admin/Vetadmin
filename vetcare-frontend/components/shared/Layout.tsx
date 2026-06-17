"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Only render user-dependent content after client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const NavLinks = () => {
    if (!mounted) return null;
    return (
      <>
        {user?.role === 'VET_DOCTOR' ? (
          <>
            <Link href="/vet/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/vet/schedule" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">My Schedule</Link>
            <Link href="/vet/patients" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Patients</Link>
            <Link href="/vet/telemedicine" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Telemedicine</Link>
            <Link href="/vet/prescriptions" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Prescriptions</Link>
          </>
        ) : user?.role === 'LAB_TECH' ? (
          <>
            <Link href="/lab/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/lab/inventory" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Inventory</Link>
          </>
        ) : user?.role === 'ACCOUNTANT' ? (
          <>
            <Link href="/finance/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/finance/invoices" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Invoices</Link>
            <Link href="/finance/expenses" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Expenses</Link>
          </>
        ) : user?.role === 'HR_MANAGER' ? (
          <>
            <Link href="/hr/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/hr/staff" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Staff</Link>
            <Link href="/hr/attendance" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Attendance</Link>
          </>
        ) : user?.role === 'SUPER_ADMIN' || user?.role === 'BRANCH_ADMIN' ? (
          <>
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/admin/branches" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Branches</Link>
            <Link href="/admin/users" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Users</Link>
            <Link href="/admin/audit-logs" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Audit Logs</Link>
          </>
        ) : user?.role === 'CUSTOMER' ? (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
            <Link href="/appointments" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Appointments</Link>
            <Link href="/pets" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">My Pets</Link>
            <Link href="/invoices" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Invoices</Link>
          </>
        ) : (
          <Link href="/" className="text-gray-600 hover:text-primary-600 py-2 md:py-0">Dashboard</Link>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🦅</span>
                <span className="text-xl font-bold text-primary-600">Horus Vet</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              {mounted && user ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="hidden lg:inline text-sm text-gray-600 font-medium">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : mounted ? (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm active:scale-95"
                >
                  Login
                </Link>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-6 bg-white animate-in slide-in-from-top duration-200">
              <div className="flex flex-col gap-2 px-2">
                <NavLinks />
                {user && (
                  <div className="mt-6 pt-6 border-t px-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account</p>
                    <p className="text-sm font-medium text-gray-900 mb-2 truncate">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Horus Vet Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
