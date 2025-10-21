'use client';
// /app/(student)/privileges/page.tsx
// Updated to accept real data via props

import React, { useState, useMemo } from 'react';
import type { Privilege, Student, TranscriptItem, Prisma } from '@prisma/client';
import { checkQualification } from '@/lib/utils';
import { SearchIcon } from '@/Components/ui/icons';

// Define the expected props for the component
type StudentWithTranscript = Student & { transcript: TranscriptItem[] };
type PrivilegeWithCriteria = Privilege & { criteria: Prisma.JsonValue };

interface PrivilegeHubProps {
    student: StudentWithTranscript;
    privileges: PrivilegeWithCriteria[];
    onSelectPrivilege: (id: number) => void;
}

const PrivilegeHub: React.FC<PrivilegeHubProps> = ({ student, privileges, onSelectPrivilege }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredPrivileges = useMemo(() => {
        return privileges
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => filterType === 'all' || p.type === filterType);
    }, [searchTerm, filterType, privileges]);

    return (
         <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">รายการสิทธิพิเศษทั้งหมด</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <input 
                        type="text" 
                        placeholder="ค้นหาสิทธิพิเศษ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-gray-400" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>ทั้งหมด</button>
                    <button onClick={() => setFilterType('ประจำมหาวิทยาลัย')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === 'ประจำมหาวิทยาลัย' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>ประจำมหาวิทยาลัย</button>
                    <button onClick={() => setFilterType('ประจำคณะ')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === 'ประจำคณะ' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>ประจำคณะ</button>
                    <button onClick={() => setFilterType('บางโอกาส')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === 'บางโอกาส' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>บางโอกาส</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrivileges.map(p => {
                    // Cast criteria to 'any' for checkQualification function
                    const { isQualified } = checkQualification(student, p.criteria as any);
                    const status = isQualified ? 'มีคุณสมบัติ' : 'ไม่มีคุณสมบัติ';
                    return (
                         <div key={p.id} onClick={() => onSelectPrivilege(p.id)} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
                             <div className={`p-4 border-l-4 ${isQualified ? 'border-green-500' : 'border-red-500'}`}>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 mb-2">{p.title}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isQualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{p.description}</p>
                            </div>
                         </div>
                    );
                })}
            </div>
         </div>
    );
};

export default PrivilegeHub;

