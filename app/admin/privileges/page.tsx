'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { Student, TranscriptItem, Prisma, Privilege } from '@prisma/client';

// Import the specific types we need from the Modal component
import { PrivilegeModal, type PrivilegeWithCriteria, type PrivilegeFormData } from '@/Components/admin/PrivilegeModal';
import { StudentListModal } from '@/Components/admin/StudentListModal';
import { ConfirmDeleteModal } from '@/Components/admin/ConfirmDeleteModal';
import { checkQualification } from '@/lib/utils';

// Define a type that includes the relations we need
type StudentWithTranscript = Student & {
    transcript: TranscriptItem[];
};

const PrivilegeManagement = () => {
    const [privileges, setPrivileges] = useState<PrivilegeWithCriteria[]>([]);
    const [students, setStudents] = useState<StudentWithTranscript[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isPrivilegeModalOpen, setIsPrivilegeModalOpen] = useState(false);
    const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    const [editingPrivilege, setEditingPrivilege] = useState<PrivilegeWithCriteria | null>(null);
    const [viewingStudentsFor, setViewingStudentsFor] = useState<PrivilegeWithCriteria | null>(null);
    const [deletingPrivilege, setDeletingPrivilege] = useState<PrivilegeWithCriteria | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [privilegesRes, studentsRes] = await Promise.all([
                fetch('/api/privileges'),
                fetch('/api/students'),
            ]);

            if (!privilegesRes.ok) throw new Error('Failed to fetch privileges');
            if (!studentsRes.ok) throw new Error('Failed to fetch students');

            const privilegesData = await privilegesRes.json();
            const studentsData = await studentsRes.json();

            setPrivileges(privilegesData);
            setStudents(studentsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleAddNewClick = () => {
        setEditingPrivilege(null);
        setIsPrivilegeModalOpen(true);
    };

    const handleEditClick = (privilege: PrivilegeWithCriteria) => {
        setEditingPrivilege(privilege);
        setIsPrivilegeModalOpen(true);
    };

    const handleDeleteClick = (privilege: PrivilegeWithCriteria) => {
        setDeletingPrivilege(privilege);
        setIsConfirmDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingPrivilege) return;
        try {
            const response = await fetch(`/api/privileges/${deletingPrivilege.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete privilege.');
            }
            setPrivileges(prev => prev.filter(p => p.id !== deletingPrivilege.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsConfirmDeleteModalOpen(false);
            setDeletingPrivilege(null);
        }
    };

    // Correct the parameter type to match what PrivilegeModal sends
    const handleSaveOrUpdatePrivilege = async (privilegeData: PrivilegeFormData) => {
        const { id, ...data } = privilegeData;
        const url = id ? `/api/privileges/${id}` : '/api/privileges';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to save privilege.');
            }
            // Refresh data after saving
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsPrivilegeModalOpen(false);
            setEditingPrivilege(null);
        }
    };


    const handleViewStudentsClick = (privilege: PrivilegeWithCriteria) => {
        setViewingStudentsFor(privilege);
        setIsStudentListModalOpen(true);
    };
    
    const qualifiedStudentsForSelected = useMemo(() => {
        if (!viewingStudentsFor) return [];
        return students.filter(s => checkQualification(s, viewingStudentsFor.criteria as any).isQualified);
    }, [viewingStudentsFor, students]);


    if (isLoading) return <div className="p-8 text-center">Loading data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;


    return (
        <>
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">จัดการสิทธิพิเศษ</h2>
                    <button onClick={handleAddNewClick} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        + เพิ่มสิทธิพิเศษใหม่
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xl text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">ชื่อสิทธิพิเศษ</th>
                                <th className="px-6 py-3">ประเภท</th>
                                <th className="px-6 py-3">นิสิตที่มีคุณสมบัติ</th>
                                <th className="px-6 py-3">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {privileges.map(p => {
                                const qualifiedCount = students.filter(s => checkQualification(s, p.criteria as any).isQualified).length;
                                return (
                                    <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.title}</th>
                                        <td className="px-6 py-4">{p.type}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleViewStudentsClick(p)} className="text-indigo-600 hover:underline font-semibold">
                                                {qualifiedCount} คน
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleEditClick(p)} className="font-medium text-indigo-600 hover:underline">แก้ไข</button>
                                            <button onClick={() => handleDeleteClick(p)} className="font-medium text-red-600 hover:underline">ลบ</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <PrivilegeModal
                isOpen={isPrivilegeModalOpen}
                onClose={() => setIsPrivilegeModalOpen(false)}
                onSave={handleSaveOrUpdatePrivilege}
                editingPrivilege={editingPrivilege}
            />
            <StudentListModal
                isOpen={isStudentListModalOpen}
                onClose={() => setIsStudentListModalOpen(false)}
                privilege={viewingStudentsFor}
                students={qualifiedStudentsForSelected}
            />
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteModalOpen}
                onClose={() => setIsConfirmDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                privilegeName={deletingPrivilege?.title || ''}
            />
        </>
    );
};

export default PrivilegeManagement;

