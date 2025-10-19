// /app/(admin)/privileges/page.tsx
// คอมโพเนนต์สำหรับหน้าจัดการสิทธิพิเศษ

import React from 'react';
import { mockPrivileges, mockAllStudents } from '@/data/mock';
import { checkQualification } from '@/lib/utils';

const PrivilegeManagement = () => {
    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">จัดการสิทธิพิเศษ</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    + เพิ่มสิทธิพิเศษใหม่
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ชื่อสิทธิพิเศษ</th>
                            <th scope="col" className="px-6 py-3">ประเภท</th>
                            <th scope="col" className="px-6 py-3">นิสิตที่มีคุณสมบัติ</th>
                            <th scope="col" className="px-6 py-3">การกระทำ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPrivileges.map(p => (
                             <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.title}</th>
                                <td className="px-6 py-4">{p.type}</td>
                                <td className="px-6 py-4">
                                    {mockAllStudents.filter(s => checkQualification(s, p.criteria).isQualified).length} คน
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="font-medium text-indigo-600 hover:underline">แก้ไข</button>
                                    <button className="font-medium text-red-600 hover:underline">ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrivilegeManagement;
