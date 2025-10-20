const { PrismaClient } = require('@prisma/client');

// สร้าง instance ของ PrismaClient
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. สร้างข้อมูล Staff ---
  console.log('Seeding staff...');
  await prisma.staff.upsert({
    where: { id: 'staff001' },
    update: {},
    create: {
      id: 'staff001',
      name: 'อ.ใจดี มีเมตตา',
      role: 'เจ้าหน้าที่คณะวิศวกรรมศาสตร์',
      avatarUrl: 'https://placehold.co/100x100/9f7aea/ffffff?text=JD',
      email: 'jaidee.m@uni.ac.th'
    },
  });
  await prisma.staff.upsert({
    where: { id: 'admin01' },
    update: {},
    create: {
        id: 'admin01',
        name: 'ผู้ดูแลระบบ',
        role: 'ผู้ดูแลระบบสูงสุด',
        avatarUrl: 'https://placehold.co/100x100/718096/ffffff?text=AD',
        email: 'admin@uni.ac.th'
    },
  });

  // --- 2. สร้างข้อมูล Privileges ---
  console.log('Seeding privileges...');
  const privilegesData = [
      { id: 1, title: 'ทุนเรียนดี', type: 'ประจำมหาวิทยาลัย', description: 'มอบทุนการศึกษาสำหรับนิสิตที่มีผลการเรียนยอดเยี่ยม', reward: 'ทุนการศึกษา 20,000 บาท', criteria: { gpax: 3.75, studyYear: { min: 2, max: 4 } } },
      { id: 2, title: 'โครงการแลกเปลี่ยน ณ ประเทศญี่ปุ่น', type: 'บางโอกาส', description: 'โอกาสในการไปศึกษาและแลกเปลี่ยนวัฒนธรรม', reward: 'ตั๋วเครื่องบินและที่พัก', criteria: { gpax: 3.50, requiredCourses: ['GEN101'], studyYear: { min: 3, max: 3 } } },
      { id: 3, title: 'ผู้ช่วยสอนวิชา CPE101', type: 'ประจำคณะ', description: 'ร่วมเป็นส่วนหนึ่งของทีมสอนในรายวิชาพื้นฐานสำคัญ', reward: 'ค่าตอบแทนรายชั่วโมง', criteria: { gpax: 3.25, specificCourseGrade: { courseId: 'CPE101', grade: 'A' } } },
      { id: 4, title: 'สิทธิ์ในการจองที่จอดรถโซนพิเศษ', type: 'ประจำมหาวิทยาลัย', description: 'อำนวยความสะดวกในการเดินทางมาเรียน', reward: 'สติกเกอร์จอดรถโซน A', criteria: { studyYear: { min: 4, max: 4 } } },
  ];

  for (const p of privilegesData) {
      await prisma.privilege.upsert({
          where: { id: p.id },
          update: {
              title: p.title,
              type: p.type,
              description: p.description,
              reward: p.reward,
              criteriaGpax: p.criteria.gpax,
              criteriaStudyYearMin: p.criteria.studyYear?.min,
              criteriaStudyYearMax: p.criteria.studyYear?.max,
              criteriaRequiredCourses: p.criteria.requiredCourses || [],
              criteriaSpecificCourseId: p.criteria.specificCourseGrade?.courseId,
              criteriaSpecificCourseGrade: p.criteria.specificCourseGrade?.grade,
          },
          create: {
              id: p.id,
              title: p.title,
              type: p.type,
              description: p.description,
              reward: p.reward,
              criteriaGpax: p.criteria.gpax,
              criteriaStudyYearMin: p.criteria.studyYear?.min,
              criteriaStudyYearMax: p.criteria.studyYear?.max,
              criteriaRequiredCourses: p.criteria.requiredCourses || [],
              criteriaSpecificCourseId: p.criteria.specificCourseGrade?.courseId,
              criteriaSpecificCourseGrade: p.criteria.specificCourseGrade?.grade,
          },
      });
  }


  // --- 3. สร้างข้อมูล Students พร้อม Transcript ---
  console.log('Seeding students...');
  const studentsData = [
    { id: '66010001', name: 'สมชาย เรียนดี', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/667eea/ffffff?text=SC', gpax: 3.85, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'B+' }] },
    { id: '66010002', name: 'สมศรี มีชัย', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมไฟฟ้า', avatarUrl: 'https://placehold.co/100x100/ed64a6/ffffff?text=SM', gpax: 3.92, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'A' }] },
    { id: '65020011', name: 'มานะ อดทน', faculty: 'วิทยาศาสตร์', major: 'วิทยาการคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/48bb78/ffffff?text=MA', gpax: 3.76, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'B' }] },
    { id: '64030025', name: 'ปิติ ยินดี', faculty: 'บริหารธุรกิจ', major: 'การตลาด', avatarUrl: 'https://placehold.co/100x100/ecc94b/ffffff?text=PY', gpax: 3.45, studyYear: 2, transcript: [{ courseId: 'GEN101', grade: 'C+' }] },
    { id: '66010005', name: 'วีระ กล้าหาญ', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมโยธา', avatarUrl: 'https://placehold.co/100x100/f56565/ffffff?text=VK', gpax: 3.15, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'C' }] },
    { id: '65020015', name: 'สุดา ใจงาม', faculty: 'วิทยาศาสตร์', major: 'เคมี', avatarUrl: 'https://placehold.co/100x100/4299e1/ffffff?text=SJ', gpax: 3.88, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'A' }] },
    { id: '64040030', name: 'มานี ชูใจ', faculty: 'มนุษยศาสตร์', major: 'ภาษาอังกฤษ', avatarUrl: 'https://placehold.co/100x100/a3bf2f/ffffff?text=MC', gpax: 3.60, studyYear: 2, transcript: [] },
    { id: '66010008', name: 'อาทิตย์ ตั้งใจ', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/d53f8c/ffffff?text=AT', gpax: 3.20, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'B' }, { courseId: 'GEN101', grade: 'B' }] },
    { id: '63050040', name: 'จันทรา แจ่มใส', faculty: 'ศิลปกรรมศาสตร์', major: 'ออกแบบนิเทศศิลป์', avatarUrl: 'https://placehold.co/100x100/6b46c1/ffffff?text=JJ', gpax: 3.95, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'A' }] },
    { id: '65020022', name: 'เอกราช มั่นคง', faculty: 'วิทยาศาสตร์', major: 'ฟิสิกส์', avatarUrl: 'https://placehold.co/100x100/dd6b20/ffffff?text=EM', gpax: 2.90, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'C' }] },
  ];

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: {
        id: student.id,
        name: student.name,
        faculty: student.faculty,
        major: student.major,
        avatarUrl: student.avatarUrl,
        gpax: student.gpax,
        studyYear: student.studyYear,
        transcript: {
          create: student.transcript,
        },
      },
    });
    console.log(`Created or updated student with id: ${student.id}`);
  }

  console.log(`Seeding finished.`);
}

// รัน function main และจัดการ error/การปิด connection
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

