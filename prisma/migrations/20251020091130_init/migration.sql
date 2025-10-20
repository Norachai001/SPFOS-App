-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "major" TEXT,
    "avatarUrl" TEXT NOT NULL,
    "gpax" DOUBLE PRECISION NOT NULL,
    "studyYear" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privilege" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "criteriaGpax" DOUBLE PRECISION,
    "criteriaStudyYearMin" INTEGER,
    "criteriaStudyYearMax" INTEGER,
    "criteriaRequiredCourses" TEXT[],
    "criteriaSpecificCourseId" TEXT,
    "criteriaSpecificCourseGrade" TEXT,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptItem" (
    "id" SERIAL NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "TranscriptItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_key" ON "Student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_id_key" ON "Staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TranscriptItem_studentId_courseId_key" ON "TranscriptItem"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "TranscriptItem" ADD CONSTRAINT "TranscriptItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
