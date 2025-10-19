
import { ExclamationIcon } from '@/Components/ui/icons';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, privilegeName }: {
    isOpen: boolean; onClose: () => void; onConfirm: () => void; privilegeName: string;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 text-center">
                    <ExclamationIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">ยืนยันการลบ</h3>
                    <p className="text-gray-600">คุณแน่ใจหรือไม่ว่าต้องการลบสิทธิพิเศษ <br /><strong className="font-semibold text-red-700">"{privilegeName}"</strong>?</p>
                </div>
                <div className="flex justify-center p-4 bg-gray-50 rounded-b-lg gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ยกเลิก</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">ยืนยันการลบ</button>
                </div>
            </div>
        </div>
    );
};