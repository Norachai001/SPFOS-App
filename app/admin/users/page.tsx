'use client';

import React, { useState, useEffect } from 'react';
import type { Staff } from '@prisma/client';

const UserManagement = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/staff');
                if (!response.ok) {
                    throw new Error('Failed to fetch staff data.');
                }
                const data = await response.json();
                setStaff(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaff();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading staff data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">รายชื่อผู้ใช้งาน (เจ้าหน้าที่)</h2>
                {/* The "Add new user" button has been removed */}
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ชื่อ-สกุล</th>
                            <th scope="col" className="px-6 py-3">อีเมล</th>
                            <th scope="col" className="px-6 py-3">ตำแหน่ง</th>
                            {/* The "Actions" column has been removed */}
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(user => (
                             <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">{user.name}</th>
                                <td className="px-6 py-4">{user.email || '-'}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                {/* "Edit" and "Delete" buttons have been removed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

