// /app/(student)/privileges/[id]/page.tsx
// คอมโพเนนต์สำหรับหน้าแสดงรายละเอียดสิทธิพิเศษ

import React from 'react';
import { Student, Privilege } from '@/data/types';
import { checkQualification } from '@/lib/utils';
import { CheckCircleIcon, XCircleIcon } from '@/Components/ui/icons';

interface PrivilegeDetailPageProps {
    student: Student;
    privilegeId: number | null;
    privileges: Privilege[];
    onBack: () => void;
}

const PrivilegeDetailPage: React.FC<PrivilegeDetailPageProps> = ({ student, privilegeId, privileges, onBack }) => {
    const privilege = privileges.find(p => p.id === privilegeId);
    if (!privilege) return <div className="p-8 text-center">ไม่พบสิทธิพิเศษ</div>;

    const { details } = checkQualification(student, privilege.criteria);

    const renderCriterion = (key: string, label: string, conditionText: string) => {
        const hasCriterion = key in details;
        if (!hasCriterion) return null; // Don't render if criterion doesn't apply
        
        return (
            <li key={key} className="flex items-center space-x-3 py-2">
                {details[key] ? <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />}
                <span>{label}: <span className="font-semibold text-gray-700">{conditionText}</span></span>
            </li>
        );
    };

    return (
         <div className="p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-indigo-600 hover:underline font-medium">
                &larr; กลับไปหน้ารายการ
            </button>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 bg-gray-50 border-b">
                    <h2 className="text-3xl font-bold text-gray-900">{privilege.title}</h2>
                    <p className="text-gray-600 mt-1">{privilege.description}</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">รายละเอียด</h3>
                        <div className="space-y-3 text-gray-700">
                             <p><strong className="w-24 inline-block">ประเภท:</strong> {privilege.type}</p>
                             <p><strong className="w-24 inline-block">รางวัล:</strong> {privilege.reward}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Checklist คุณสมบัติส่วนตัว</h3>
                        <ul className="text-gray-600">
                            {renderCriterion('gpax', 'GPAX ขั้นต่ำ', `>= ${privilege.criteria.gpax}`)}
                            {renderCriterion('studyYear', 'ชั้นปี', `ระหว่าง ${privilege.criteria.studyYear?.min} - ${privilege.criteria.studyYear?.max}`)}
                            {renderCriterion('requiredCourses', 'รายวิชาที่ต้องผ่าน', privilege.criteria.requiredCourses?.join(', ') || '')}
                            {renderCriterion('specificCourseGrade', 'เกรดรายวิชาเฉพาะ', `${privilege.criteria.specificCourseGrade?.courseId} ต้องได้เกรด ${privilege.criteria.specificCourseGrade?.grade} ขึ้นไป`)}
                        </ul>
                    </div>
                </div>
            </div>
         </div>
    );
};

export default PrivilegeDetailPage;
