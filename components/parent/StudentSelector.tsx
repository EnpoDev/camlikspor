"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
}

export function StudentSelector({
  students,
  selectedId
}: {
  students: Student[];
  selectedId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (studentId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('studentId', studentId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <Users className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedId} onValueChange={handleChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.firstName} {student.lastName} - {student.studentNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
