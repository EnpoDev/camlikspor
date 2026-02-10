"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Search, Users } from "lucide-react";
import {
  updateGroupStudentsAction,
  type GroupFormState,
} from "@/lib/actions/groups";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string | null;
}

interface GroupStudentsManagerProps {
  groupId: string;
  allStudents: Student[];
  assignedStudentIds: string[];
}

export function GroupStudentsManager({
  groupId,
  allStudents,
  assignedStudentIds,
}: GroupStudentsManagerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(assignedStudentIds)
  );
  const [search, setSearch] = useState("");

  const filteredStudents = allStudents.filter((student) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const number = student.studentNumber?.toLowerCase() || "";
    return fullName.includes(query) || number.includes(query);
  });

  const [state, formAction, isPending] = useActionState<GroupFormState, FormData>(
    updateGroupStudentsAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.refresh();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  function toggleStudent(studentId: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(studentId);
      } else {
        next.delete(studentId);
      }
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ogrenciler ({selectedIds.size})
        </CardTitle>
        <CardDescription>Gruba ogrenci atayin</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <input type="hidden" name="groupId" value={groupId} />
          {Array.from(selectedIds).map((id) => (
            <input key={id} type="hidden" name="studentIds" value={id} />
          ))}
          {allStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henuz ogrenci bulunmuyor.
            </p>
          ) : (
            <>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ogrenci ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 max-h-80 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-full">
                  Aramayla eslesen ogrenci bulunamadi.
                </p>
              ) : filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedIds.has(student.id)}
                    onCheckedChange={(checked) =>
                      toggleStudent(student.id, checked === true)
                    }
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {student.firstName} {student.lastName}
                    {student.studentNumber && (
                      <span className="ml-1 text-muted-foreground">
                        ({student.studentNumber})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
            </>
          )}
          <div className="mt-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
