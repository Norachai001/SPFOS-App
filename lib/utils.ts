// /lib/utils.ts
// Updated to use Prisma-generated types and handle null criteria.

import type { Student, TranscriptItem, Prisma, Privilege } from '@prisma/client';

// Define a type for a Student object that includes their transcript relationship
type StudentWithTranscript = Student & {
    transcript: TranscriptItem[];
};

// Define a type for the structured criteria object, as it's stored as JSON in the DB
type PrivilegeCriteria = {
    gpax?: number;
    studyYear?: { min: number; max: number };
    requiredCourses?: string[];
    specificCourseGrade?: { courseId: string; grade: string };
};

export const checkQualification = (student: StudentWithTranscript, criteriaJSON: Prisma.JsonValue) => {
    // --- ADDED NULL CHECK ---
    // If criteria is null or not an object, there are no requirements.
    // Therefore, the student is qualified by default.
    if (!criteriaJSON || typeof criteriaJSON !== 'object') {
        return { isQualified: true, details: {} };
    }

    // Safely cast the JSON criteria to our structured type
    const criteria = criteriaJSON as PrivilegeCriteria;

    const results: Record<string, boolean> = {};
    let isQualified = true;

    if (criteria.gpax) {
        results.gpax = student.gpax >= criteria.gpax;
        if (!results.gpax) isQualified = false;
    }
    if (criteria.studyYear) {
        results.studyYear = student.studyYear >= (criteria.studyYear.min ?? 0) && student.studyYear <= (criteria.studyYear.max ?? 99);
        if (!results.studyYear) isQualified = false;
    }
    if (criteria.requiredCourses && criteria.requiredCourses.length > 0) {
        results.requiredCourses = criteria.requiredCourses.every(rc => 
            student.transcript.some(t => t.courseId === rc)
        );
        if (!results.requiredCourses) isQualified = false;
    }
    if (criteria.specificCourseGrade?.courseId && criteria.specificCourseGrade?.grade) {
        const sc = criteria.specificCourseGrade;
        const gradeMap: Record<string, number> = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2 };
        const requiredGrade = gradeMap[sc.grade] || 0;
        const studentCourse = student.transcript.find(t => t.courseId === sc.courseId);
        const studentGrade = studentCourse ? (gradeMap[studentCourse.grade] || 0) : 0;
        results.specificCourseGrade = studentGrade >= requiredGrade;
        if (!results.specificCourseGrade) isQualified = false;
    }
    
    return { isQualified, details: results };
};

// This function is likely no longer needed in the same way, as logic might move
// But it's updated here for consistency if still used.
export const getPrivilegeStatus = (student: StudentWithTranscript, privileges: (Privilege & { criteria: Prisma.JsonValue })[]) => {
    const achieved: (Privilege & { criteria: Prisma.JsonValue })[] = [];
    const nearlyAchieved: (Privilege & { criteria: Prisma.JsonValue; reason?: string })[] = [];
    const notAchieved: (Privilege & { criteria: Prisma.JsonValue })[] = [];

    privileges.forEach(p => {
        const criteria = p.criteria as PrivilegeCriteria; // Cast for use
        const { isQualified } = checkQualification(student, p.criteria);
        
        if (isQualified) {
            achieved.push(p);
        } else {
            if (criteria?.gpax && student.gpax >= criteria.gpax - 0.1 && student.gpax < criteria.gpax) {
                 nearlyAchieved.push({ ...p, reason: `ขาด GPAX อีก ${(criteria.gpax - student.gpax).toFixed(2)}` });
            } else if (criteria?.studyYear?.min && student.studyYear === criteria.studyYear.min - 1) {
                 nearlyAchieved.push({ ...p, reason: `รออีก 1 ปีการศึกษา` });
            }
            else {
                notAchieved.push(p);
            }
        }
    });

    return { achieved, nearlyAchieved, notAchieved };
};

