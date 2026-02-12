import { prisma } from "@/lib/prisma";

export async function getGroupAiContext(groupId: string, dealerId?: string) {
  const whereClause: { id: string; dealerId?: string } = { id: groupId };
  if (dealerId) whereClause.dealerId = dealerId;

  const group = await prisma.group.findFirst({
    where: whereClause,
    include: {
      branch: { select: { name: true } },
      facility: { select: { name: true } },
      period: { select: { name: true } },
      schedules: true,
      trainers: {
        include: {
          trainer: { select: { firstName: true, lastName: true } },
        },
      },
      students: {
        where: { isActive: true },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              birthDate: true,
              gender: true,
              attendances: {
                orderBy: { createdAt: "desc" },
                take: 20,
                select: { status: true },
              },
              developments: {
                orderBy: { date: "desc" },
                select: { category: true, metric: true, score: true },
              },
            },
          },
        },
      },
    },
  });

  if (!group) return null;

  const now = new Date();
  const students = group.students.map((sg) => {
    const s = sg.student;
    const age = Math.floor(
      (now.getTime() - new Date(s.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const totalAttendance = s.attendances.length;
    const presentCount = s.attendances.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE"
    ).length;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const devScores: Record<string, { metric: string; score: number }[]> = {};
    for (const d of s.developments) {
      if (!devScores[d.category]) devScores[d.category] = [];
      devScores[d.category].push({ metric: d.metric, score: d.score });
    }

    return {
      name: `${s.firstName} ${s.lastName}`,
      age,
      gender: s.gender,
      attendanceRate,
      totalAttendanceRecords: totalAttendance,
      development: devScores,
    };
  });

  const ages = students.map((s) => s.age);
  const averageAge = ages.length > 0 ? Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10 : 0;
  const overallAttendanceRate = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
    : 0;

  return {
    groupName: group.name,
    branch: group.branch.name,
    facility: group.facility.name,
    period: group.period.name,
    maxCapacity: group.maxCapacity,
    totalStudents: students.length,
    averageAge,
    overallAttendanceRate,
    schedules: group.schedules.map((sc) => ({
      dayOfWeek: sc.dayOfWeek,
      startTime: sc.startTime,
      endTime: sc.endTime,
    })),
    trainers: group.trainers.map((tg) => ({
      name: `${tg.trainer.firstName} ${tg.trainer.lastName}`,
      isPrimary: tg.isPrimary,
    })),
    students,
  };
}

export async function getGroupById(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      dealer: { select: { name: true } },
      branch: { select: { id: true, name: true } },
      facility: { select: { id: true, name: true } },
      period: { select: { id: true, name: true } },
      schedules: true,
      students: {
        where: { isActive: true },
        include: {
          student: {
            select: { id: true, firstName: true, lastName: true, studentNumber: true },
          },
        },
      },
      trainers: {
        include: {
          trainer: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
}
