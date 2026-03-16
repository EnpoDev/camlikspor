import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, CalendarOff } from "lucide-react";

const statusConfig = {
  PRESENT: { label: "Katıldı", icon: Check, className: "bg-green-500 text-white" },
  ABSENT: { label: "Katılmadı", icon: X, className: "bg-red-500 text-white" },
  LATE: { label: "Geç Kaldı", icon: Clock, className: "bg-yellow-500 text-white" },
  EXCUSED: { label: "İzinli", icon: CalendarOff, className: "bg-blue-500 text-white" },
};

export function AttendanceStatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
