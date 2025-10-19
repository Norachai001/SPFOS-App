// /app/(admin)/reports/page.tsx
// คอมโพเนนต์สำหรับหน้าศูนย์รายงาน

import React from 'react';

const ReportingCenter = () => (
    <div className="p-4 md:p-8">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">ศูนย์รายงาน</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-bold text-lg mb-4">สร้างรายงาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ประเภทสิทธิพิเศษ</label>
                    <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option>ทั้งหมด</option>
                        <option>ประจำมหาวิทยาลัย</option>
                        <option>ประจำคณะ</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">คณะ</label>
                    <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option>ทั้งหมด</option>
                        <option>วิศวกรรมศาสตร์</option>
                        <option>วิทยาศาสตร์</option>
                        <option>บริหารธุรกิจ</option>
                    </select>
                </div>
                <div className="self-end">
                    <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        สร้างรายงาน
                    </button>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">ผลลัพธ์ (ตัวอย่าง)</h3>
            <p className="text-gray-600">ส่วนนี้จะแสดงผลลัพธ์ของรายงานเป็นกราฟและตารางที่สามารถดาวน์โหลดได้</p>
        </div>
    </div>
);

export default ReportingCenter;
