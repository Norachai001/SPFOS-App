'use client';
import React, { useState, useEffect } from 'react';
import type { Prisma, Privilege } from '@prisma/client';
import { XCircleIcon } from '@/Components/ui/icons';

// Define a structured type for the criteria object for form state
type CriteriaObject = {
    gpax?: number;
    studyYear?: { min?: number; max?: number };
    requiredCourses?: string[];
    specificCourseGrade?: { courseId?: string; grade?: string };
};

// Add 'export' to make this type available for other files to import
export type PrivilegeFormData = {
    id?: number;
    title: string;
    type: string;
    description: string;
    reward: string;
    criteria: Prisma.JsonValue;
};

// This is the type for the full privilege object received from the parent component
export type PrivilegeWithCriteria = Privilege & {
    criteria: Prisma.JsonValue;
};

// Define the props for the Modal component using the types above
interface PrivilegeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (privilegeData: PrivilegeFormData) => void;
    editingPrivilege: PrivilegeWithCriteria | null;
}

export const PrivilegeModal = ({ isOpen, onClose, onSave, editingPrivilege }: PrivilegeModalProps) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('ประจำมหาวิทยาลัย');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    // State for criteria form fields, using our structured CriteriaObject type
    const [criteria, setCriteria] = useState<CriteriaObject>({});
    const isEditing = !!editingPrivilege;

    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingPrivilege.criteria) {
                setTitle(editingPrivilege.title);
                setType(editingPrivilege.type);
                setDescription(editingPrivilege.description);
                setReward(editingPrivilege.reward);
                // When editing, cast the JsonValue to our CriteriaObject
                setCriteria(editingPrivilege.criteria as CriteriaObject);
            } else {
                // Reset form for new privilege
                setTitle('');
                setType('ประจำมหาวิทยาลัย');
                setDescription('');
                setReward('');
                setCriteria({});
            }
        }
    }, [editingPrivilege, isOpen, isEditing]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        if (!title || !description || !reward) {
            alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, คำอธิบาย, และรางวัล");
            return;
        }

        // Clean up empty criteria fields before saving
        const cleanedCriteria: CriteriaObject = { ...criteria };
        if (!cleanedCriteria.gpax) delete cleanedCriteria.gpax;
        if (!cleanedCriteria.studyYear?.min && !cleanedCriteria.studyYear?.max) delete cleanedCriteria.studyYear;
        if (!cleanedCriteria.requiredCourses || cleanedCriteria.requiredCourses.length === 0) delete cleanedCriteria.requiredCourses;
        if (!cleanedCriteria.specificCourseGrade?.courseId) delete cleanedCriteria.specificCourseGrade;

        const privilegeData: PrivilegeFormData = {
            id: isEditing ? editingPrivilege.id : undefined,
            title,
            type,
            description,
            reward,
            criteria: cleanedCriteria as Prisma.JsonValue,
        };

        onSave(privilegeData);
    };

    const handleCriteriaChange = <K extends keyof CriteriaObject>(field: K, value: CriteriaObject[K]) => {
        setCriteria(prev => ({ ...prev, [field]: value }));
    };

    const handleStudyYearChange = (field: 'min' | 'max', value: string) => {
        const intValue = value ? parseInt(value, 10) : undefined;
        setCriteria(prev => ({
            ...prev,
            studyYear: {
                ...prev.studyYear,
                [field]: isNaN(intValue!) ? undefined : intValue,
            }
        }));
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
                    <div><label>ชื่อสิทธิพิเศษ</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                    <div><label>ประเภท</label><select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option>ประจำมหาวิทยาลัย</option><option>ประจำคณะ</option><option>บางโอกาส</option></select></div>
                    <div><label>คำอธิบาย</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea></div>
                    <div><label>รางวัล</label><input type="text" value={reward} onChange={e => setReward(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">เครื่องมือสร้างเงื่อนไข</h4>
                        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                            <div><label className="flex items-center gap-2"><span>GPAX ≥</span><input type="number" step="0.01" value={criteria.gpax || ''} onChange={e => handleCriteriaChange('gpax', parseFloat(e.target.value) || undefined)} className="w-full p-2 border rounded-md" /></label></div>
                            <div><label>ชั้นปี</label><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="ต่ำสุด" value={criteria.studyYear?.min || ''} onChange={e => handleStudyYearChange('min', e.target.value)} className="w-full p-2 border rounded-md" /><input type="number" placeholder="สูงสุด" value={criteria.studyYear?.max || ''} onChange={e => handleStudyYearChange('max', e.target.value)} className="w-full p-2 border rounded-md" /></div></div>
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

