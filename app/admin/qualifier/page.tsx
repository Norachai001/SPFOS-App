'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Privilege, Student, TranscriptItem } from '@prisma/client';
import { checkQualification } from '@/lib/utils';
import { Prisma } from '@prisma/client';

// Define a type that includes the relations we need
type StudentWithTranscript = Student & {
    transcript: TranscriptItem[];
};

type PrivilegeWithCriteria = Privilege & {
    criteria: Prisma.JsonValue;
};

const StudentQualifierPage = () => {
    const [privileges, setPrivileges] = useState<PrivilegeWithCriteria[]>([]);
    const [students, setStudents] = useState<StudentWithTranscript[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrivilegeId, setSelectedPrivilegeId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [privilegesRes, studentsRes] = await Promise.all([
                    fetch('/api/privileges'),
                    fetch('/api/students'),
                ]);

                if (!privilegesRes.ok || !studentsRes.ok) {
                    throw new Error('Failed to fetch initial data');
                }

                const privilegesData = await privilegesRes.json();
                const studentsData = await studentsRes.json();

                setPrivileges(privilegesData);
                setStudents(studentsData);

                // Set default selected privilege if available
                if (privilegesData.length > 0) {
                    setSelectedPrivilegeId(privilegesData[0].id);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const qualifiedStudents = useMemo(() => {
        if (!selectedPrivilegeId) return [];

        const selectedPrivilege = privileges.find(p => p.id === selectedPrivilegeId);
        if (!selectedPrivilege) return [];

        // Since criteria is JSON, we need to cast it to use it
        return students.filter(s => checkQualification(s,selectedPrivilege.criteria as any).isQualified);
    }, [selectedPrivilegeId, privileges, students]);

    if (isLoading) return <div className="p-8 text-center">Loading data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">คัดกรองนิสิต</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <label htmlFor="privilege-select" className="mr-2 font-medium">เลือกสิทธิพิเศษ:</label>
                    <select
                        id="privilege-select"
                        value={selectedPrivilegeId || ''}
                        onChange={e => setSelectedPrivilegeId(Number(e.target.value))}
                        className="p-2 border rounded-lg"
                        disabled={privileges.length === 0}
                    >
                        {privileges.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
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
