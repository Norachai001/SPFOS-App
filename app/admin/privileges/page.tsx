// /app/(admin)/privileges/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';

// NOTE: All dependencies are consolidated into this single file to resolve build-time pathing errors.
// In a standard project, these would be in separate files and imported.

// --- CONSOLIDATED DEFINITIONS ---

// From /data/types.ts
interface TranscriptItem {
    courseId: string;
    grade: string;
}
interface Student {
    id: string;
    name: string;
    faculty: string;
    avatarUrl: string;
    gpax: number;
    studyYear: number;
    transcript: TranscriptItem[];
}
interface PrivilegeCriteria {
    gpax?: number;
    studyYear?: { min: number; max: number };
    requiredCourses?: string[];
    specificCourseGrade?: { courseId: string; grade: string; };
}
interface Privilege {
    id: number;
    title: string;
    type: string;
    description: string;
    reward: string;
    criteria: PrivilegeCriteria;
}

// From /data/mock.ts
const mockPrivileges: Privilege[] = [
    { id: 1, title: 'ทุนเรียนดี', type: 'ประจำมหาวิทยาลัย', description: 'มอบทุนการศึกษาสำหรับนิสิตที่มีผลการเรียนยอดเยี่ยม', reward: 'ทุนการศึกษา 20,000 บาท', criteria: { gpax: 3.75, studyYear: { min: 2, max: 4 } } },
    { id: 2, title: 'โครงการแลกเปลี่ยน ณ ประเทศญี่ปุ่น', type: 'บางโอกาส', description: 'โอกาสในการไปศึกษาและแลกเปลี่ยนวัฒนธรรม', reward: 'ตั๋วเครื่องบินและที่พัก', criteria: { gpax: 3.50, requiredCourses: ['GEN101'], studyYear: { min: 3, max: 3 } } },
];
const mockAllStudents: Student[] = [
    { id: '66010001', name: 'สมชาย เรียนดี', faculty: 'วิศวกรรมศาสตร์', gpax: 3.85, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'B+' }], avatarUrl: 'https://placehold.co/100x100' },
    { id: '66010002', name: 'สมศรี มีชัย', faculty: 'วิศวกรรมศาสตร์', gpax: 3.92, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'A' }], avatarUrl: 'https://placehold.co/100x100' },
];

// From /lib/utils.ts
const checkQualification = (student: Student, criteria: PrivilegeCriteria) => {
    let isQualified = true;
    if (criteria.gpax && student.gpax < criteria.gpax) isQualified = false;
    if (criteria.studyYear && (student.studyYear < criteria.studyYear.min || student.studyYear > criteria.studyYear.max)) isQualified = false;
    return { isQualified };
};

// From /components/ui/icons.tsx
const XCircleIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
);
const ExclamationIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
);


// From /components/admin/PrivilegeModal.tsx
const PrivilegeModal = ({ isOpen, onClose, onSave, editingPrivilege }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (privilege: Omit<Privilege, 'id'> & { id?: number }) => void;
    editingPrivilege: Privilege | null;
}) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('ประจำมหาวิทยาลัย');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [criteria, setCriteria] = useState<Partial<PrivilegeCriteria>>({});
    const isEditing = !!editingPrivilege;

    useEffect(() => {
        if (isOpen && isEditing) {
            setTitle(editingPrivilege.title);
            setType(editingPrivilege.type);
            setDescription(editingPrivilege.description);
            setReward(editingPrivilege.reward);
            setCriteria(editingPrivilege.criteria || {});
        } else {
            setTitle(''); setType('ประจำมหาวิทยาลัย'); setDescription(''); setReward(''); setCriteria({});
        }
    }, [editingPrivilege, isOpen]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        if (!title || !description || !reward) {
            alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, คำอธิบาย, และรางวัล"); return;
        }
        const finalCriteria: PrivilegeCriteria = {
            gpax: criteria.gpax && !isNaN(criteria.gpax) ? criteria.gpax : undefined,
            studyYear: (criteria.studyYear?.min && criteria.studyYear?.max && !isNaN(criteria.studyYear.min) && !isNaN(criteria.studyYear.max)) ? { min: criteria.studyYear.min, max: criteria.studyYear.max } : undefined,
        };
        const privilegeData = { id: isEditing ? editingPrivilege.id : undefined, title, type, description, reward, criteria: finalCriteria };
        onSave(privilegeData);
    };
    
    const handleCriteriaChange = <K extends keyof PrivilegeCriteria>(field: K, value: PrivilegeCriteria[K]) => setCriteria(prev => ({ ...prev, [field]: value }));
    const handleStudyYearChange = (field: 'min' | 'max', value: string) => {
        const intValue = parseInt(value, 10);
        const currentMin = criteria.studyYear?.min ?? NaN;
        const currentMax = criteria.studyYear?.max ?? NaN;
        const newStudyYear = { min: field === 'min' ? intValue : currentMin, max: field === 'max' ? intValue : currentMax };
        handleCriteriaChange('studyYear', newStudyYear);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'แก้ไขสิทธิพิเศษ' : 'เพิ่มสิทธิพิเศษใหม่'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircleIcon className="w-8 h-8" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Form fields */}
                    <div><label>ชื่อสิทธิพิเศษ</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/></div>
                    <div><label>ประเภท</label><select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option>ประจำมหาวิทยาลัย</option><option>ประจำคณะ</option><option>บางโอกาส</option></select></div>
                    <div><label>คำอธิบาย</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea></div>
                    <div><label>รางวัล</label><input type="text" value={reward} onChange={e => setReward(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/></div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">เครื่องมือสร้างเงื่อนไข</h4>
                        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                            <div><label className="flex items-center gap-2"><span>GPAX ≥</span><input type="number" step="0.01" value={criteria.gpax || ''} onChange={e => handleCriteriaChange('gpax', parseFloat(e.target.value))} className="w-full p-2 border rounded-md"/></label></div>
                            <div><label>ชั้นปี</label><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="ต่ำสุด" value={criteria.studyYear?.min || ''} onChange={e => handleStudyYearChange('min', e.target.value)} className="w-full p-2 border rounded-md"/><input type="number" placeholder="สูงสุด" value={criteria.studyYear?.max || ''} onChange={e => handleStudyYearChange('max', e.target.value)} className="w-full p-2 border rounded-md"/></div></div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2">ยกเลิก</button>
                    <button onClick={handleSaveClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">บันทึก</button>
                </div>
            </div>
        </div>
    );
};

// From /components/admin/StudentListModal.tsx
const StudentListModal = ({ isOpen, onClose, privilege, students }: {
    isOpen: boolean; onClose: () => void; privilege: Privilege | null; students: Student[];
}) => {
    if (!isOpen || !privilege) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold truncate">รายชื่อผู้มีสิทธิ์: {privilege.title}</h3>
                    <button onClick={onClose}><XCircleIcon className="w-8 h-8 text-gray-400 hover:text-gray-600" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {students.length > 0 ? (
                        <ul className="space-y-2">{students.map(s => <li key={s.id} className="p-2 bg-gray-100 rounded-md">
                            <p className="font-semibold">{s.name}</p><p className="text-sm text-gray-500">{s.id} - GPAX: {s.gpax.toFixed(2)}</p></li>)}</ul>
                    ) : <p className="text-center text-gray-500">ไม่พบนิสิตที่ผ่านเกณฑ์</p>}
                </div>
                <div className="flex justify-end p-4 border-t"><button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">ปิด</button></div>
            </div>
        </div>
    );
};

// From /components/admin/ConfirmDeleteModal.tsx
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, privilegeName }: {
    isOpen: boolean; onClose: () => void; onConfirm: () => void; privilegeName: string;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 text-center">
                    <ExclamationIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">ยืนยันการลบ</h3>
                    <p className="text-gray-600">คุณแน่ใจหรือไม่ว่าต้องการลบสิทธิพิเศษ <br/><strong className="font-semibold text-red-700">"{privilegeName}"</strong>?</p>
                </div>
                <div className="flex justify-center p-4 bg-gray-50 rounded-b-lg gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ยกเลิก</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">ยืนยันการลบ</button>
                </div>
            </div>
        </div>
    );
};


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
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">ชื่อสิทธิพิเศษ</th>
                                <th className="px-6 py-3">ประเภท</th>
                                <th className="px-6 py-3">นิสิตที่มีคุณสมบัติ</th>
                                <th className="px-6 py-3">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {privileges.map(p => {
                                const qualifiedStudents = mockAllStudents.filter(s => checkQualification(s, p.criteria).isQualified);
                                return (
                                    <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
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

