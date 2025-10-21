// /app/page.tsx
// This file is the main application component, managing state and rendering pages.
// Switched from React.lazy to next/dynamic for compatibility with Next.js App Router.
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Navbar from '@/Components/layout/Navbar';
import type { Student, Staff, Privilege, TranscriptItem, Prisma } from '@prisma/client';

// Define combined types for state
type CurrentUser = (Student & { transcript: TranscriptItem[] }) | Staff | null;
type PrivilegeWithCriteria = Privilege & { criteria: Prisma.JsonValue };

// --- Use next/dynamic for all page components ---
// This handles lazy loading correctly in the Next.js App Router.
const LoadingSpinner = () => <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

const LoginPage = dynamic(() => import('@/app/login/page'), { loading: () => <LoadingSpinner /> });
const StudentDashboard = dynamic(() => import('@/app/student/dashboard/page'), { loading: () => <LoadingSpinner /> });
const PrivilegeHub = dynamic(() => import('@/app/student/privileges/page'), { loading: () => <LoadingSpinner /> });
const PrivilegeDetailPage = dynamic(() => import('@/app/student/privileges/[id]/page'), { loading: () => <LoadingSpinner /> });

const AdminDashboard = dynamic(() => import('@/app/admin/dashboard/page'), { loading: () => <LoadingSpinner /> });
const PrivilegeManagement = dynamic(() => import('@/app/admin/privileges/page'), { loading: () => <LoadingSpinner /> });
const StudentQualifierPage = dynamic(() => import('@/app/admin/qualifier/page'), { loading: () => <LoadingSpinner /> });
const ReportingCenter = dynamic(() => import('@/app/admin/reports/page'), { loading: () => <LoadingSpinner /> });
const UserManagement = dynamic(() => import('@/app/admin/users/page'), { loading: () => <LoadingSpinner /> });


export default function Home() {
    const [userType, setUserType] = useState<'student' | 'staff' | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
    const [privileges, setPrivileges] = useState<PrivilegeWithCriteria[]>([]);

    const [page, setPage] = useState('dashboard');
    const [selectedPrivilegeId, setSelectedPrivilegeId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleLogin = async (type: 'student' | 'staff') => {
        setUserType(type);
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, you'd authenticate and fetch the specific user.
            // Here, we fetch a sample user and all privileges.
            const userRes = type === 'student'
                ? await fetch('/api/students/66010001') // Fetch a sample student
                : await fetch('/api/staff/staff001');   // Fetch a sample staff

            const privilegesRes = await fetch('/api/privileges');

            if (!userRes.ok || !privilegesRes.ok) {
                throw new Error('Failed to load initial data.');
            }

            const userData = await userRes.json();
            const privilegesData = await privilegesRes.json();

            setCurrentUser(userData);
            setPrivileges(privilegesData);
            setPage('dashboard');

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setUserType(null); // Reset on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setUserType(null);
        setCurrentUser(null);
        setPrivileges([]);
        setPage('dashboard');
    };

    const handleSelectPrivilege = (id: number) => {
        setSelectedPrivilegeId(id);
        setPage('detail');
    };

    const handleBackToHub = () => {
        setSelectedPrivilegeId(null);
        setPage('hub');
    }

    const handleAdminNav = (targetPage: string) => {
        setPage(targetPage);
    };

    const renderStudentContent = () => {
        if (!currentUser || !('gpax' in currentUser)) return <LoadingSpinner />; // Type guard

        switch (page) {
            case 'hub':
                return <PrivilegeHub student={currentUser} privileges={privileges} onSelectPrivilege={handleSelectPrivilege} />;
            case 'detail':
                return <PrivilegeDetailPage student={currentUser} privilegeId={selectedPrivilegeId} privileges={privileges} onBack={handleBackToHub} />;
            case 'dashboard':
            default:
                return <StudentDashboard student={currentUser} privileges={privileges} />;
        }
    };

    const renderStaffContent = () => {
        switch (page) {
            case 'privilege-management':
                return <PrivilegeManagement />;
            case 'student-qualifier':
                return <StudentQualifierPage />;
            case 'reporting-center':
                return <ReportingCenter />;
            case 'user-management':
                return <UserManagement />;
            case 'dashboard':
            default:
                return <AdminDashboard onNavigate={handleAdminNav} />;
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="h-screen w-screen flex flex-col items-center justify-center text-red-500">
            <p>An error occurred:</p>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
                Try Again
            </button>
        </div>;
    }


    if (!userType || !currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const user = currentUser;

    if (userType === 'student') {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar user={user} onLogout={handleLogout} />
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start h-12">
                            <div className="flex space-x-8">
                                <button onClick={() => setPage('dashboard')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>แดชบอร์ด</button>
                                <button onClick={() => setPage('hub')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'hub' || page === 'detail' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>สิทธิพิเศษทั้งหมด</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <main>
                    {renderStudentContent()}
                </main>
            </div>
        );
    }

    if (userType === 'staff') {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar user={user} onLogout={handleLogout} />
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start h-12 overflow-x-auto">
                            <div className="flex space-x-8 whitespace-nowrap">
                                <button onClick={() => setPage('dashboard')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>แดชบอร์ด</button>
                                <button onClick={() => setPage('privilege-management')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'privilege-management' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>จัดการสิทธิพิเศษ</button>
                                <button onClick={() => setPage('student-qualifier')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'student-qualifier' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>คัดกรองนิสิต</button>
                                <button onClick={() => setPage('reporting-center')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'reporting-center' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>ศูนย์รายงาน</button>
                                <button onClick={() => setPage('user-management')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${page === 'user-management' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>จัดการผู้ใช้งาน</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <main>
                    {renderStaffContent()}
                </main>

            </div>
        );
    }

    return null;
}

