// /lib/utils.ts
// ไฟล์นี้สำหรับฟังก์ชันช่วยเหลือ (helper functions) ที่ใช้คำนวณคุณสมบัติของนิสิต

import { Student, Privilege, PrivilegeCriteria } from '@/data/types';

export const checkQualification = (student: Student, criteria: PrivilegeCriteria) => {
    const results: Record<string, boolean> = {};
    let isQualified = true;

    if (criteria.gpax) {
        results.gpax = student.gpax >= criteria.gpax;
        if (!results.gpax) isQualified = false;
    }
    if (criteria.studyYear) {
        results.studyYear = student.studyYear >= criteria.studyYear.min && student.studyYear <= criteria.studyYear.max;
        if (!results.studyYear) isQualified = false;
    }
    if (criteria.requiredCourses) {
        results.requiredCourses = Array.isArray(student.transcript) && criteria.requiredCourses.every(rc => 
            student.transcript.some(t => t.courseId === rc)
        );
        if (!results.requiredCourses) isQualified = false;
    }
    if (criteria.specificCourseGrade) {
        const sc = criteria.specificCourseGrade;
        const gradeMap: Record<string, number> = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2 };
        const requiredGrade = gradeMap[sc.grade] || 0;
        const studentCourse = Array.isArray(student.transcript) ? student.transcript.find(t => t.courseId === sc.courseId) : undefined;
        const studentGrade = studentCourse ? (gradeMap[studentCourse.grade] || 0) : 0;
        results.specificCourseGrade = studentGrade >= requiredGrade;
        if (!results.specificCourseGrade) isQualified = false;
    }
    
    return { isQualified, details: results };
};

export const getPrivilegeStatus = (student: Student, privileges: Privilege[]) => {
    const achieved: Privilege[] = [];
    const nearlyAchieved: Privilege[] = [];
    const notAchieved: Privilege[] = [];

    privileges.forEach(p => {
        const { isQualified } = checkQualification(student, p.criteria);
        if (isQualified) {
            achieved.push(p);
        } else {
            // Check for 'nearly' status
            if (p.criteria.gpax && student.gpax >= p.criteria.gpax - 0.1 && student.gpax < p.criteria.gpax) {
                 nearlyAchieved.push({ ...p, reason: `ขาด GPAX อีก ${(p.criteria.gpax - student.gpax).toFixed(2)}` });
            } else if (p.criteria.studyYear && p.criteria.studyYear.min && student.studyYear === p.criteria.studyYear.min - 1) {
                 nearlyAchieved.push({ ...p, reason: `รออีก 1 ปีการศึกษา` });
            }
            else {
                notAchieved.push(p);
            }
        }
    });

    return { achieved, nearlyAchieved, notAchieved };
};
