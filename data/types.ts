// /data/types.ts
// ไฟล์นี้ใช้สำหรับกำหนดโครงสร้างข้อมูลทั้งหมดในโปรเจกต์ (TypeScript Interfaces)

export interface TranscriptItem {
    courseId: string;
    grade: string;
}

export interface Student {
    id: string;
    name: string;
    faculty: string;
    major?: string;
    avatarUrl: string;
    gpax: number;
    studyYear: number;
    transcript: TranscriptItem[];
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    email?: string;
}

export interface PrivilegeCriteria {
    gpax?: number;
    studyYear?: { min: number; max: number };
    requiredCourses?: string[];
    specificCourseGrade?: { courseId: string; grade: string };
}

export interface Privilege {
    id: number;
    title: string;
    type: string;
    description: string;
    reward: string;
    criteria: PrivilegeCriteria;
    reason?: string; // For 'nearly achieved'
}
