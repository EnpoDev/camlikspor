"use server";

import { prisma } from "@/lib/prisma";

/**
 * Gets the weekly schedule for a student based on their active groups.
 * Returns schedules grouped by dayOfWeek with group name, time range, and location.
 */
export async function getStudentSchedule(studentId: string) {
  const studentGroups = await prisma.studentGroup.findMany({
    where: {
      studentId,
      isActive: true,
    },
    include: {
      group: {
        include: {
          schedules: true,
          facility: true,
          branch: true,
        },
      },
    },
  });

  // Flatten all schedules, enriching with group context
  const allSchedules = studentGroups.flatMap((sg) =>
    sg.group.schedules.map((schedule) => ({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      groupName: sg.group.name,
      facilityName: sg.group.facility?.name || null,
      branchName: sg.group.branch?.name || null,
    }))
  );

  // Group by dayOfWeek (0=Sunday, 1=Monday ... 6=Saturday)
  const schedulesByDay: Record<number, typeof allSchedules> = {};
  for (let day = 0; day <= 6; day++) {
    schedulesByDay[day] = allSchedules
      .filter((s) => s.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return schedulesByDay;
}

/**
 * Gets attendance records for a student with summary statistics.
 */
export async function getStudentAttendance(
  studentId: string,
  limit: number = 30
) {
  const attendances = await prisma.attendance.findMany({
    where: { studentId },
    include: {
      session: {
        include: {
          group: true,
        },
      },
    },
    orderBy: {
      session: {
        date: "desc",
      },
    },
    take: limit,
  });

  const total = attendances.length;
  const present = attendances.filter((a) => a.status === "PRESENT").length;
  const absent = attendances.filter((a) => a.status === "ABSENT").length;
  const late = attendances.filter((a) => a.status === "LATE").length;
  const excused = attendances.filter((a) => a.status === "EXCUSED").length;
  const attendanceRate =
    total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return {
    records: attendances,
    stats: {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate,
    },
  };
}

/**
 * Gets payment summary for a student (for student self-view)
 */
export async function getStudentPayments(studentId: string) {
  const payments = await prisma.payment.findMany({
    where: { studentId },
    orderBy: { dueDate: "desc" },
  });

  const pending = payments.filter((p) => p.status === "PENDING");
  const completed = payments.filter((p) => p.status === "COMPLETED");

  const totalDebt = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = completed.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalDebt,
    totalPaid,
    pendingPayments: pending,
    completedPayments: completed,
  };
}

/**
 * Gets development records for a student (for student self-view)
 */
export async function getStudentDevelopment(studentId: string) {
  const developments = await prisma.studentDevelopment.findMany({
    where: { studentId },
    orderBy: { date: "desc" },
  });

  // Group by category for summary view
  const byCategory = developments.reduce(
    (acc, d) => {
      if (!acc[d.category]) {
        acc[d.category] = [];
      }
      acc[d.category].push(d);
      return acc;
    },
    {} as Record<string, typeof developments>
  );

  // Calculate average score per category
  const categorySummary = Object.entries(byCategory).map(([category, records]) => {
    const avgScore =
      records.reduce((sum, r) => sum + r.score, 0) / records.length;
    return {
      category,
      avgScore: Math.round(avgScore * 10) / 10,
      recordCount: records.length,
      latestDate: records[0]?.date ?? null,
    };
  });

  return {
    developments,
    categorySummary,
    totalRecords: developments.length,
  };
}

/**
 * Gets full student profile with related entities for settings view
 */
export async function getStudentProfile(studentId: string) {
  return prisma.student.findUnique({
    where: { id: studentId },
    include: {
      branch: true,
      location: true,
      facility: true,
    },
  });
}
