// /app/page.tsx
// นี่คือไฟล์หลักของแอปพลิเคชัน ทำหน้าที่จัดการ State และการแสดงผลของหน้าต่างๆ
//comment out the line below if you are not using 'use client' directive
'use client';

import React, { useState, Suspense } from 'react';
import { mockStudent, mockStaff, mockPrivileges } from '@/data/mock';
import Navbar from '@/Components/layout/Navbar';

// Lazy load all page components
const LoginPage = React.lazy(() => import('@/app/login/page'));
const StudentDashboard = React.lazy(() => import('@/app/student/dashboard/page'));
const PrivilegeHub = React.lazy(() => import('@/app/student/privileges/page'));
const PrivilegeDetailPage = React.lazy(() => import('@/app/student/privileges/[id]/page'));

const AdminDashboard = React.lazy(() => import('@/app/admin/dashboard/page'));
const PrivilegeManagement = React.lazy(() => import('@/app/admin/privileges/page'));
const StudentQualifierPage = React.lazy(() => import('@/app/admin/qualifier/page'));
const ReportingCenter = React.lazy(() => import('@/app/admin/reports/page'));
const UserManagement = React.lazy(() => import('@/app/admin/users/page'));


export default function Home() {
    const [userType, setUserType] = useState<'student' | 'staff' | null>(null);
    const [page, setPage] = useState('dashboard'); // 'dashboard', 'hub', 'detail', etc.
    const [selectedPrivilegeId, setSelectedPrivilegeId] = useState<number | null>(null);

    const handleLogin = (type: 'student' | 'staff') => {
        setUserType(type);
        setPage('dashboard');
    };

    const handleLogout = () => {
        setUserType(null);
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
        switch (page) {
            case 'hub':
                return <PrivilegeHub student={mockStudent} privileges={mockPrivileges} onSelectPrivilege={handleSelectPrivilege} />;
            case 'detail':
                return <PrivilegeDetailPage student={mockStudent} privilegeId={selectedPrivilegeId} privileges={mockPrivileges} onBack={handleBackToHub} />;
            case 'dashboard':
            default:
                return <StudentDashboard student={mockStudent} privileges={mockPrivileges} />;
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

    if (!userType) {
        return (
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                <LoginPage onLogin={handleLogin} />
            </Suspense>
        );
    }

    if (userType === 'student') {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar user={mockStudent} onLogout={handleLogout} />
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
                    <Suspense fallback={<div className="p-8 text-center">Loading Page...</div>}>
                        {renderStudentContent()}
                    </Suspense>
                </main>
            </div>
        );
    }

    if (userType === 'staff') {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar user={mockStaff} onLogout={handleLogout} />
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
                    <Suspense fallback={<div className="p-8 text-center">Loading Page...</div>}>
                        {renderStaffContent()}
                    </Suspense>
                </main>

            </div>
        );
    }

    return null;
}

