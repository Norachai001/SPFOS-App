// /data/mock.ts
// ไฟล์นี้รวบรวมข้อมูลจำลอง (mock data) ทั้งหมดที่ใช้ในแอปพลิเคชัน

import { Student, Staff, Privilege } from './types';

export const mockStudent: Student = {
    id: '66010001',
    name: 'สมชาย เรียนดี',
    faculty: 'วิศวกรรมศาสตร์',
    major: 'วิศวกรรมคอมพิวเตอร์',
    avatarUrl: 'https://placehold.co/100x100/667eea/ffffff?text=SC',
    gpax: 3.85,
    studyYear: 4,
    transcript: [
        { courseId: 'CPE101', grade: 'A' },
        { courseId: 'GEN101', grade: 'B+' },
        { courseId: 'PHY101', grade: 'A' },
        { courseId: 'MTH101', grade: 'A' },
        { courseId: 'CPE344', grade: 'A' },
    ],
};

export const mockStaff: Staff = {
    id: 'staff001',
    name: 'อ.ใจดี มีเมตตา',
    role: 'เจ้าหน้าที่คณะวิศวกรรมศาสตร์',
    avatarUrl: 'https://placehold.co/100x100/9f7aea/ffffff?text=JD',
};

export const mockPrivileges: Privilege[] = [
    {
        id: 1,
        title: 'ทุนเรียนดี',
        type: 'ประจำมหาวิทยาลัย',
        description: 'มอบทุนการศึกษาสำหรับนิสิตที่มีผลการเรียนยอดเยี่ยม',
        reward: 'ทุนการศึกษา 20,000 บาท',
        criteria: { gpax: 3.75, studyYear: { min: 2, max: 4 } },
    },
    {
        id: 2,
        title: 'โครงการแลกเปลี่ยน ณ ประเทศญี่ปุ่น',
        type: 'บางโอกาส',
        description: 'โอกาสในการไปศึกษาและแลกเปลี่ยนวัฒนธรรม ณ มหาวิทยาลัยโตเกียว',
        reward: 'ตั๋วเครื่องบินและที่พัก',
        criteria: { gpax: 3.50, requiredCourses: ['GEN101'], studyYear: { min: 3, max: 3 } },
    },
    {
        id: 3,
        title: 'ผู้ช่วยสอนวิชา CPE101',
        type: 'ประจำคณะ',
        description: 'ร่วมเป็นส่วนหนึ่งของทีมสอนในรายวิชาพื้นฐานสำคัญ',
        reward: 'ค่าตอบแทนรายชั่วโมง',
        criteria: { gpax: 3.25, specificCourseGrade: { courseId: 'CPE101', grade: 'A' } },
    },
    {
        id: 4,
        title: 'สิทธิ์ในการจองที่จอดรถโซนพิเศษ',
        type: 'ประจำมหาวิทยาลัย',
        description: 'อำนวยความสะดวกในการเดินทางมาเรียน',
        reward: 'สติกเกอร์จอดรถโซน A',
        criteria: { studyYear: { min: 4, max: 4 } },
    },
     {
        id: 5,
        title: 'โครงการ Fast-track ปริญญาโท',
        type: 'ประจำคณะ',
        description: 'เรียนต่อปริญญาโทได้ทันทีหลังจบปริญญาตรีโดยไม่ต้องสอบเข้า',
        reward: 'ยกเว้นค่าธรรมเนียมการสมัคร',
        criteria: { gpax: 3.90, studyYear: { min: 4, max: 4 } },
    },
];

export const mockAllStudents: Student[] = [
    { id: '66010001', name: 'สมชาย เรียนดี', faculty: 'วิศวกรรมศาสตร์', gpax: 3.85, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'B+' }], avatarUrl: 'https://placehold.co/100x100/667eea/ffffff?text=SC' },
    { id: '66010002', name: 'สมศรี มีชัย', faculty: 'วิศวกรรมศาสตร์', gpax: 3.92, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'A' }], avatarUrl: 'https://placehold.co/100x100/ed64a6/ffffff?text=SM' },
    { id: '65020011', name: 'มานะ อดทน', faculty: 'วิทยาศาสตร์', gpax: 3.76, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'B' }], avatarUrl: 'https://placehold.co/100x100/48bb78/ffffff?text=MA' },
    { id: '64030025', name: 'ปิติ ยินดี', faculty: 'บริหารธุรกิจ', gpax: 3.55, studyYear: 2, transcript: [{ courseId: 'GEN101', grade: 'C+' }], avatarUrl: 'https://placehold.co/100x100/ecc94b/ffffff?text=PY' },
];

export const mockStaffUsers: Staff[] = [
    { id: 'staff001', name: 'อ.ใจดี มีเมตตา', role: 'เจ้าหน้าที่คณะวิศวกรรมศาสตร์', email: 'jaidee.m@uni.ac.th', avatarUrl: 'https://placehold.co/100x100/9f7aea/ffffff?text=JD' },
    { id: 'staff002', name: 'อ.สมศรี สอนเก่ง', role: 'เจ้าหน้าที่คณะวิทยาศาสตร์', email: 'somsri.s@uni.ac.th', avatarUrl: 'https://placehold.co/100x100/63b3ed/ffffff?text=SS' },
    { id: 'admin01', name: 'ผู้ดูแลระบบ', role: 'ผู้ดูแลระบบสูงสุด', email: 'admin@uni.ac.th', avatarUrl: 'https://placehold.co/100x100/718096/ffffff?text=AD' },
];
