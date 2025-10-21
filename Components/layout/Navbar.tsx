// /components/layout/Navbar.tsx
// คอมโพเนนต์ Navbar สำหรับแสดงส่วนหัวของเว็บ

import React from 'react';
import type { Student,Staff  } from '@prisma/client';
import { MenuIcon, LogoutIcon } from '@/Components/ui/icons';

interface NavbarProps {
    user: Student | Staff;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-indigo-600">
                <MenuIcon />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Student Privilege System</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="font-semibold text-gray-700">{user.name}</p>
                <p className="text-sm text-gray-500">{'role' in user ? user.role : user.id}</p>
            </div>
            <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <button onClick={onLogout} className="text-gray-600 hover:text-red-500">
                <LogoutIcon />
            </button>
        </div>
    </header>
);

export default Navbar;
