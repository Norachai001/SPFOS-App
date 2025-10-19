// /app/(admin)/qualifier/page.tsx
// คอมโพเนนต์สำหรับหน้าคัดกรองนิสิต

import React, { useState, useMemo } from 'react';
import { mockPrivileges, mockAllStudents } from '@/data/mock';
import { checkQualification } from '@/lib/utils';

const StudentQualifierPage = () => {
    const [selectedPrivilegeId, setSelectedPrivilegeId] = useState(mockPrivileges[0].id);
    
    const qualifiedStudents = useMemo(() => {
        const selectedPrivilege = mockPrivileges.find(p => p.id === selectedPrivilegeId);
        if (!selectedPrivilege) return [];
        return mockAllStudents.filter(s => checkQualification(s, selectedPrivilege.criteria).isQualified);
    }, [selectedPrivilegeId]);
    
    return (
        <div className="p-4 md:p-8">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">คัดกรองนิสิต</h2>
             <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
                 <div>
                    <label htmlFor="privilege-select" className="mr-2 font-medium">เลือกสิทธิพิเศษ:</label>
                    <select 
                        id="privilege-select" 
                        value={selectedPrivilegeId}
                        onChange={e => setSelectedPrivilegeId(Number(e.target.value))}
                        className="p-2 border rounded-lg"
                    >
                        {mockPrivileges.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                 </div>
                 <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
                    Export to Excel
                 </button>
             </div>
             <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                             <th scope="col" className="px-6 py-3">รหัสนิสิต</th>
                            <th scope="col" className="px-6 py-3">ชื่อ-สกุล</th>
                            <th scope="col" className="px-6 py-3">คณะ</th>
                            <th scope="col" className="px-6 py-3">GPAX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {qualifiedStudents.map(s => (
                             <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{s.id}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">{s.name}</th>
                                <td className="px-6 py-4">{s.faculty}</td>
                                <td className="px-6 py-4">{s.gpax.toFixed(2)}</td>
                            </tr>
                        ))}
                         {qualifiedStudents.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">ไม่พบนิสิตที่ผ่านเกณฑ์</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentQualifierPage;
