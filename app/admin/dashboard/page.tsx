// /app/(admin)/dashboard/page.tsx
// คอมโพเนนต์สำหรับหน้าแดชบอร์ดของผู้ดูแลระบบ

import React from 'react';
import { mockPrivileges } from '../../../data/mock';

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => (
    <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ดผู้ดูแล</h2>
        
        {/* Key Metric Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500">นิสิตที่มีคุณสมบัติ (รวม)</h3>
                <p className="text-3xl font-bold text-indigo-600">500</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500">สิทธิพิเศษทั้งหมด</h3>
                <p className="text-3xl font-bold text-purple-600">{mockPrivileges.length}</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500">ผู้สมัครใหม่วันนี้</h3>
                <p className="text-3xl font-bold text-green-600">12</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500">รอการอนุมัติ</h3>
                <p className="text-3xl font-bold text-yellow-600">3</p>
            </div>
        </div>

        {/* Chart & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">สรุปผู้ได้รับสิทธิพิเศษ (ตามประเภท)</h3>
                {/* Simulated Bar Chart */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-36 text-sm text-gray-600">ประจำมหาวิทยาลัย</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-6">
                            <div className="bg-indigo-500 h-6 rounded-full text-center text-white text-xs leading-6" style={{ width: '80%' }}>350</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="w-36 text-sm text-gray-600">ประจำคณะ</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-6">
                            <div className="bg-purple-500 h-6 rounded-full text-center text-white text-xs leading-6" style={{ width: '60%' }}>210</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="w-36 text-sm text-gray-600">บางโอกาส</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-6">
                            <div className="bg-green-500 h-6 rounded-full text-center text-white text-xs leading-6" style={{ width: '40%' }}>80</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="font-bold text-lg mb-4">เมนูทางลัด</h3>
                 <div className="space-y-4">
                     <button onClick={() => onNavigate('privilege-management')} className="w-full text-left p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-semibold text-indigo-700 transition">จัดการสิทธิพิเศษ</button>
                     <button onClick={() => onNavigate('student-qualifier')} className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg font-semibold text-purple-700 transition">คัดกรองนิสิต</button>
                     <button onClick={() => onNavigate('reporting-center')} className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg font-semibold text-green-700 transition">ศูนย์รายงาน</button>
                 </div>
            </div>
        </div>
    </div>
);

export default AdminDashboard;

