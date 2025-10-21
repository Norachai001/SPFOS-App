const { PrismaClient } = require('@prisma/client');

// เปลี่ยนชื่อตัวแปรจาก 'prisma' เป็น 'db' เพื่อหลีกเลี่ยงการประกาศซ้ำซ้อน
const db = new PrismaClient();
// ข้อมูลจำลอง (Mock Data)
// ... (ข้อมูลส่วนนี้เหมือนเดิม) ...
const staffData = [
  {
    id: 'staff001',
    name: 'อ.ใจดี มีเมตตา',
    role: 'เจ้าหน้าที่คณะวิศวกรรมศาสตร์',
    email: 'jaidee.m@uni.ac.th',
    avatarUrl: 'https://placehold.co/100x100/9f7aea/ffffff?text=JD',
  },
  {
    id: 'admin01',
    name: 'ผู้ดูแลระบบ',
    role: 'ผู้ดูแลระบบสูงสุด',
    email: 'admin@uni.ac.th',
    avatarUrl: 'https://placehold.co/100x100/718096/ffffff?text=AD',
  },
];
const privilegesData = [
    {
        title: 'ทุนเรียนดี',
        type: 'ประจำมหาวิทยาลัย',
        description: 'มอบทุนการศึกษาสำหรับนิสิตที่มีผลการเรียนยอดเยี่ยม',
        reward: 'ทุนการศึกษา 20,000 บาท',
        criteria: { gpax: 3.75, studyYear: { min: 2, max: 4 } },
    },
    {
        title: 'โครงการแลกเปลี่ยน ณ ประเทศญี่ปุ่น',
        type: 'บางโอกาส',
        description: 'โอกาสในการไปศึกษาและแลกเปลี่ยนวัฒนธรรม ณ มหาวิทยาลัยโตเกียว',
        reward: 'ตั๋วเครื่องบินและที่พัก',
        criteria: { gpax: 3.50, requiredCourses: ['GEN101'], studyYear: { min: 3, max: 3 } },
    },
    {
        title: 'ผู้ช่วยสอนวิชา CPE101',
        type: 'ประจำคณะ',
        description: 'ร่วมเป็นส่วนหนึ่งของทีมสอนในรายวิชาพื้นฐานสำคัญ',
        reward: 'ค่าตอบแทนรายชั่วโมง',
        criteria: { gpax: 3.25, specificCourseGrade: { courseId: 'CPE101', grade: 'A' } },
    },
    {
        title: 'สิทธิ์ในการจองที่จอดรถโซนพิเศษ',
        type: 'ประจำมหาวิทยาลัย',
        description: 'อำนวยความสะดวกในการเดินทางมาเรียน',
        reward: 'สติกเกอร์จอดรถโซน A',
        criteria: { studyYear: { min: 4, max: 4 } },
    },
];

const studentsData = [
  { id: '66010001', name: 'สมชาย เรียนดี', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/667eea/ffffff?text=SC', gpax: 3.85, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'B+' }] },
  { id: '66010002', name: 'สมศรี มีชัย', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมโยธา', avatarUrl: 'https://placehold.co/100x100/ed64a6/ffffff?text=SM', gpax: 3.92, studyYear: 4, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'A' }] },
  { id: '65020011', name: 'มานะ อดทน', faculty: 'วิทยาศาสตร์', major: 'วิทยาการคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/48bb78/ffffff?text=MA', gpax: 3.76, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'B' }] },
  { id: '65020012', name: 'ใจดี จริงใจ', faculty: 'วิทยาศาสตร์', major: 'เคมี', avatarUrl: 'https://placehold.co/100x100/f56565/ffffff?text=JD', gpax: 3.40, studyYear: 3, transcript: [{ courseId: 'GEN101', grade: 'A' }] },
  { id: '64030025', name: 'ปิติ ยินดี', faculty: 'บริหารธุรกิจ', major: 'การตลาด', avatarUrl: 'https://placehold.co/100x100/ecc94b/ffffff?text=PY', gpax: 3.55, studyYear: 2, transcript: [{ courseId: 'GEN101', grade: 'C+' }] },
  { id: '64030026', name: 'วีระ กล้าหาญ', faculty: 'บริหารธุรกิจ', major: 'การเงิน', avatarUrl: 'https://placehold.co/100x100/a0aec0/ffffff?text=VK', gpax: 2.99, studyYear: 2, transcript: [] },
  { id: '63040001', name: 'สวยงาม ตามท้องเรื่อง', faculty: 'ศิลปกรรมศาสตร์', major: 'ออกแบบนิเทศศิลป์', avatarUrl: 'https://placehold.co/100x100/d53f8c/ffffff?text=ST', gpax: 3.88, studyYear: 4, transcript: [{ courseId: 'GEN101', grade: 'A' }] },
  { id: '66010003', name: 'นักสู้ ผู้ยิ่งใหญ่', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมเครื่องกล', avatarUrl: 'https://placehold.co/100x100/38b2ac/ffffff?text=NP', gpax: 3.21, studyYear: 1, transcript: [] },
  { id: '65010004', name: 'ทดสอบ ระบบ', faculty: 'วิศวกรรมศาสตร์', major: 'วิศวกรรมคอมพิวเตอร์', avatarUrl: 'https://placehold.co/100x100/718096/ffffff?text=TS', gpax: 4.00, studyYear: 3, transcript: [{ courseId: 'CPE101', grade: 'A' }, { courseId: 'GEN101', grade: 'A' }] },
  { id: '64020005', name: 'เรียนไป บ่นไป', faculty: 'วิทยาศาสตร์', major: 'ฟิสิกส์', avatarUrl: 'https://placehold.co/100x100/f6ad55/ffffff?text=RB', gpax: 2.75, studyYear: 2, transcript: [{ courseId: 'GEN101', grade: 'D' }] },
];


async function main() {
  console.log('Start seeding ...');

  // Seed Staff
  try {
    console.log('Seeding staff...');
    for (const s of staffData) {
      // ใช้ db แทน prisma
      await db.staff.upsert({
        where: { id: s.id },
        update: {},
        create: s,
      });
    }
    console.log('Staff seeding finished.');
  } catch (error) {
    console.error('ERROR SEEDING STAFF:', error);
  }

  // Seed Privileges
  try {
    console.log('Seeding privileges...');
    // Delete existing privileges before creating new ones to avoid conflicts and reset IDs
    await db.privilege.deleteMany({});
    for (const p of privilegesData) {
      // ใช้ db แทน prisma
      await db.privilege.create({
        data: {
          title: p.title,
          type: p.type,
          description: p.description,
          reward: p.reward,
          criteria: p.criteria as any, // Use `as any` because Prisma expects JsonValue
        },
      });
    }
    console.log('Privileges seeding finished.');
  } catch (error) {
    console.error('ERROR SEEDING PRIVILEGES:', error);
  }

  // Seed Students and their Transcripts
  try {
    console.log('Seeding students and transcripts...');
    for (const s of studentsData) {
      const { transcript, ...studentData } = s;
      // ใช้ db แทน prisma
      await db.student.upsert({
        where: { id: studentData.id },
        update: {},
        create: {
          ...studentData,
          transcript: {
            create: transcript,
          },
        },
      });
    }
    console.log('Students and transcripts seeding finished.');
  } catch (error) {
    console.error('ERROR SEEDING STUDENTS:', error);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // ใช้ db แทน prisma
    await db.$disconnect();
  });

