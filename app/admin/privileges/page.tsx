// /app/(admin)/privileges/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
// NOTE: All dependencies are consolidated into this single file to resolve build-time pathing errors.
// In a standard project, these would be in separate files and imported.
// --- CONSOLIDATED DEFINITIONS ---
// From /data/types.ts
import { Privilege } from '@/data/types';
// From /data/mock.ts
import { mockPrivileges, mockAllStudents, } from '@/data/mock';
// From /lib/utils.ts
import { checkQualification } from '@/lib/utils';

import { PrivilegeModal } from '@/Components/admin/PrivilegeModal';
// From /components/admin/StudentListModal.tsx
import { StudentListModal } from '@/Components/admin/StudentListModa';
// From /components/admin/ConfirmDeleteModal.tsx    
import { ConfirmDeleteModal } from '@/Components/admin/ConfirmDeleteModal'


const PrivilegeManagement = () => {
    const [privileges, setPrivileges] = useState<Privilege[]>(mockPrivileges);
    const [isPrivilegeModalOpen, setIsPrivilegeModalOpen] = useState(false);
    const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [editingPrivilege, setEditingPrivilege] = useState<Privilege | null>(null);
    const [viewingStudentsFor, setViewingStudentsFor] = useState<Privilege | null>(null);
    const [deletingPrivilege, setDeletingPrivilege] = useState<Privilege | null>(null);

    const handleAddNewClick = () => {
        setEditingPrivilege(null);
        setIsPrivilegeModalOpen(true);
    };

    const handleEditClick = (privilege: Privilege) => {
        setEditingPrivilege(privilege);
        setIsPrivilegeModalOpen(true);
    };

    const handleDeleteClick = (privilege: Privilege) => {
        setDeletingPrivilege(privilege);
        setIsConfirmDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deletingPrivilege) return;
        setPrivileges(prev => prev.filter(p => p.id !== deletingPrivilege.id));
        setIsConfirmDeleteModalOpen(false);
        setDeletingPrivilege(null);
    };

    const handleSaveOrUpdatePrivilege = (privilegeData: Omit<Privilege, 'id'> & { id?: number }) => {
        if (privilegeData.id) {
            setPrivileges(prev => prev.map(p => p.id === privilegeData.id ? { ...p, ...privilegeData } as Privilege : p));
        } else {
            const newPrivilege: Privilege = {
                id: Math.max(0, ...privileges.map(p => p.id)) + 1,
                ...privilegeData,
            } as Privilege;
            setPrivileges(prev => [...prev, newPrivilege]);
        }
        setIsPrivilegeModalOpen(false);
        setEditingPrivilege(null);
    };

    const handleViewStudentsClick = (privilege: Privilege) => {
        setViewingStudentsFor(privilege);
        setIsStudentListModalOpen(true);
    };

    const qualifiedStudentsForSelected = useMemo(() => {
        if (!viewingStudentsFor) return [];
        return mockAllStudents.filter(s => checkQualification(s, viewingStudentsFor.criteria).isQualified);
    }, [viewingStudentsFor]);


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
                            {privileges.map((p, index) => {
                                const qualifiedStudents = mockAllStudents.filter(s => checkQualification(s, p.criteria).isQualified);
                                return (
                                    <tr key={`privilege-${p.id}-${index}`} className="bg-white border-b hover:bg-gray-50">
                                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.title}</th>
                                        <td className="px-6 py-4">{p.type}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleViewStudentsClick(p)} className="text-indigo-600 hover:underline font-semibold">
                                                {qualifiedStudents.length} คน
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

