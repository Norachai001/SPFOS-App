// /app/(student)/dashboard/page.tsx
// คอมโพเนนต์สำหรับหน้าแดชบอร์ดของนิสิต

import React from 'react';
import { Student, Privilege } from '@/data/types';
import { getPrivilegeStatus } from '@/lib/utils';
import PrivilegeCard from '../../../Components/ui/PrivilegeCard';
import { CheckCircleIcon, ExclamationIcon, XCircleIcon } from '../../../Components/ui/icons';

interface StudentDashboardProps {
    student: Student;
    privileges: Privilege[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, privileges }) => {
    const { achieved, nearlyAchieved, notAchieved } = getPrivilegeStatus(student, privileges);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ด</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Student Info Card */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md flex items-center">
                    <img src={student.avatarUrl} alt="Student Avatar" className="w-20 h-20 rounded-full mr-6" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                        <p className="text-gray-600">{student.id}</p>
                        <p className="text-gray-600">{student.faculty}</p>
                    </div>
                </div>
                {/* GPAX Card */}
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                     <p className="text-lg font-medium opacity-80">เกรดเฉลี่ยสะสม (GPAX)</p>
                     <p className="text-6xl font-extrabold">{student.gpax.toFixed(2)}</p>
                </div>
            </div>
            {/* Privileges Section */}
            <div>
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <CheckCircleIcon className="w-7 h-7 text-green-500 mr-2" />
                        สิทธิพิเศษที่ได้ ({achieved.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achieved.map(p => <PrivilegeCard key={p.id} privilege={p} status="achieved" />)}
                        {achieved.length === 0 && <p className="text-gray-500">ยังไม่มีสิทธิพิเศษที่ได้รับ</p>}
                    </div>
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <ExclamationIcon className="w-7 h-7 text-yellow-500 mr-2" />
                        สิทธิพิเศษที่เกือบได้ ({nearlyAchieved.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nearlyAchieved.map(p => <PrivilegeCard key={p.id} privilege={p} status="nearly" reason={p.reason} />)}
                        {nearlyAchieved.length === 0 && <p className="text-gray-500">ไม่มีสิทธิพิเศษที่เกือบได้รับ</p>}
                    </div>
                </div>
                <div>
                     <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <XCircleIcon className="w-7 h-7 text-red-500 mr-2" />
                        สิทธิพิเศษที่ยังไม่ได้รับ ({notAchieved.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notAchieved.map(p => <PrivilegeCard key={p.id} privilege={p} status="not" />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
