// /components/ui/PrivilegeCard.tsx
// คอมโพเนนต์การ์ดสำหรับแสดงข้อมูลสิทธิพิเศษแต่ละรายการ

import React from 'react';
import { Privilege } from '@/data/types';
import { CheckCircleIcon, XCircleIcon, ExclamationIcon } from './icons';

interface PrivilegeCardProps {
    privilege: Privilege;
    status: 'achieved' | 'nearly' | 'not';
    reason?: string;
}

const PrivilegeCard: React.FC<PrivilegeCardProps> = ({ privilege, status, reason }) => {
    const statusStyles = {
        'achieved': {
            icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
            bgColor: 'bg-green-50 border-green-200',
            textColor: 'text-green-700'
        },
        'nearly': {
            icon: <ExclamationIcon className="w-5 h-5 text-yellow-500" />,
            bgColor: 'bg-yellow-50 border-yellow-200',
            textColor: 'text-yellow-700'
        },
        'not': {
            icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
            bgColor: 'bg-red-50 border-red-200',
            textColor: 'text-red-700'
        }
    };
    
    const style = statusStyles[status];

    return (
        <div className={`p-4 rounded-lg border ${style.bgColor} flex flex-col justify-between`}>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{privilege.title}</h3>
                    {style.icon}
                </div>
                <p className="text-sm text-gray-600 mb-2">{privilege.description}</p>
            </div>
            {reason && <p className={`text-sm font-semibold ${style.textColor}`}>{reason}</p>}
        </div>
    );
};

export default PrivilegeCard;
