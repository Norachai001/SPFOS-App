'use client';
import { XCircleIcon } from '@/Components/ui/icons';
import type { Student, Privilege } from '@prisma/client';
export const StudentListModal = ({ isOpen, onClose, privilege, students }: {
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
