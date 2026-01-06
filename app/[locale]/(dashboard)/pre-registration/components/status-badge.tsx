"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  dictionary: {
    preRegistration: {
      status: {
        pending: string;
        contacted: string;
        converted: string;
        cancelled: string;
      };
    };
  };
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  CONTACTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  CONVERTED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusLabels: Record<string, keyof StatusBadgeProps["dictionary"]["preRegistration"]["status"]> = {
  PENDING: "pending",
  CONTACTED: "contacted",
  CONVERTED: "converted",
  CANCELLED: "cancelled",
};

export function PreRegistrationStatusBadge({ status, dictionary }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.PENDING;
  const labelKey = statusLabels[status] || "pending";
  const label = dictionary.preRegistration.status[labelKey];

  return (
    <Badge className={style} variant="secondary">
      {label}
    </Badge>
  );
}
