# API Reference - New Features

Quick reference for the newly implemented server actions.

---

## Equipment Actions

### Create Equipment
```typescript
import { createEquipmentAction } from "@/lib/actions/equipment";

// Form data required:
// - name: string (min 2 chars)
// - description: string (optional)
// - price: number (>= 0)

const result = await createEquipmentAction(prevState, formData);
// Returns: { success: boolean, message: string, errors?: object }
```

### Update Equipment
```typescript
import { updateEquipmentAction } from "@/lib/actions/equipment";

const result = await updateEquipmentAction(id, prevState, formData);
```

### Delete Equipment
```typescript
import { deleteEquipmentAction } from "@/lib/actions/equipment";

const result = await deleteEquipmentAction(id);
// Soft delete: sets isActive = false
```

---

## Personnel Actions

### Create Personnel
```typescript
import { createPersonnelAction } from "@/lib/actions/personnel";

// Form data required:
// - firstName: string (min 2 chars)
// - lastName: string (min 2 chars)
// - personnelTypeId: string (required)
// - phone: string (Turkish format)
// - email: string (optional, valid email)
// - salary: number (optional, >= 0)
// - tcKimlikNo: string (optional, 11 digits)
// - address: string (optional)
// - birthDate: string (optional, ISO date)
// - notes: string (optional)
// - workSchedule: string (optional)

const result = await createPersonnelAction(prevState, formData);
```

### Update Personnel
```typescript
import { updatePersonnelAction } from "@/lib/actions/personnel";

const result = await updatePersonnelAction(id, prevState, formData);
```

### Delete Personnel
```typescript
import { deletePersonnelAction } from "@/lib/actions/personnel";

const result = await deletePersonnelAction(id);
// Soft delete: sets isActive = false, deletedAt = now()
```

---

## Student Development Actions

### Create Student Development Record
```typescript
import { createStudentDevelopmentAction } from "@/lib/actions/student-development";

// Form data required:
// - studentId: string (required)
// - date: string (required, ISO date)
// - category: string (technical|physical|mental|tactical)
// - metric: string (ball_control|passing|shooting|etc)
// - score: number (1-10)
// - notes: string (optional)
// - trainerId: string (optional)

const result = await createStudentDevelopmentAction(prevState, formData);
```

### Update Student Development Record
```typescript
import { updateStudentDevelopmentAction } from "@/lib/actions/student-development";

const result = await updateStudentDevelopmentAction(id, prevState, formData);
```

### Delete Student Development Record
```typescript
import { deleteStudentDevelopmentAction } from "@/lib/actions/student-development";

const result = await deleteStudentDevelopmentAction(id);
// Hard delete: removes record
```

---

## Body Measurements Actions

### Create Body Measurement
```typescript
import { createBodyMeasurementAction } from "@/lib/actions/body-measurements";

// Form data required:
// - studentId: string (required)
// - date: string (required, ISO date)
// - height: number (optional, >= 0, in cm)
// - weight: number (optional, >= 0, in kg)
// - chestSize: number (optional, >= 0, in cm)
// - waistSize: number (optional, >= 0, in cm)
// - armSize: number (optional, >= 0, in cm)
// - legSize: number (optional, >= 0, in cm)
// - notes: string (optional)

const result = await createBodyMeasurementAction(prevState, formData);
```

### Update Body Measurement
```typescript
import { updateBodyMeasurementAction } from "@/lib/actions/body-measurements";

const result = await updateBodyMeasurementAction(id, prevState, formData);
```

### Delete Body Measurement
```typescript
import { deleteBodyMeasurementAction } from "@/lib/actions/body-measurements";

const result = await deleteBodyMeasurementAction(id);
// Hard delete: removes record
```

---

## Prisma Queries

### Equipment (Material)
```typescript
// List all active equipment
const equipment = await prisma.material.findMany({
  where: { dealerId, isActive: true },
  orderBy: { name: "asc" },
});

// Get single equipment
const item = await prisma.material.findUnique({
  where: { id },
});
```

### Personnel
```typescript
// List all active personnel with types
const personnel = await prisma.personnel.findMany({
  where: { dealerId, isActive: true },
  include: {
    personnelType: { select: { name: true } },
  },
  orderBy: { firstName: "asc" },
});

// Get single personnel
const person = await prisma.personnel.findUnique({
  where: { id },
  include: { personnelType: true },
});
```

### Student Development
```typescript
// List recent development records
const developments = await prisma.studentDevelopment.findMany({
  where: {
    student: { dealerId, isActive: true },
  },
  include: {
    student: {
      select: { firstName: true, lastName: true },
    },
  },
  orderBy: { date: "desc" },
  take: 100,
});

// Get by student
const studentDev = await prisma.studentDevelopment.findMany({
  where: { studentId },
  orderBy: { date: "desc" },
});
```

### Body Measurements
```typescript
// List recent measurements
const measurements = await prisma.bodyMeasurement.findMany({
  where: {
    student: { dealerId, isActive: true },
  },
  include: {
    student: {
      select: { firstName: true, lastName: true },
    },
  },
  orderBy: { date: "desc" },
  take: 100,
});

// Get by student
const studentMeasurements = await prisma.bodyMeasurement.findMany({
  where: { studentId },
  orderBy: { date: "desc" },
});

// Get latest measurement for student
const latest = await prisma.bodyMeasurement.findFirst({
  where: { studentId },
  orderBy: { date: "desc" },
});
```

---

## Error Handling

All actions return a consistent error format:

```typescript
// Success
{
  success: true,
  message: "Operation successful"
}

// Validation Error
{
  success: false,
  message: "Lütfen formu kontrol edin",
  errors: {
    fieldName: ["Error message"]
  }
}

// Server Error
{
  success: false,
  message: "Bir hata oluştu"
}

// Auth Error
{
  success: false,
  message: "Yetkilendirme hatası"
}
```

---

## Client-Side Usage

### With useActionState
```typescript
"use client";

import { useActionState } from "react";
import { createEquipmentAction } from "@/lib/actions/equipment";

export function EquipmentForm() {
  const [state, formAction, isPending] = useActionState(
    createEquipmentAction,
    { errors: {}, message: "" }
  );

  return (
    <form action={formAction}>
      {/* form fields */}
      {state.errors?.name && (
        <p className="text-destructive">{state.errors.name[0]}</p>
      )}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

### Direct Action Call
```typescript
"use client";

import { deletePersonnelAction } from "@/lib/actions/personnel";
import { toast } from "sonner";

async function handleDelete(id: string) {
  const result = await deletePersonnelAction(id);

  if (result.success) {
    toast.success(result.message);
  } else {
    toast.error(result.message);
  }
}
```

---

## Validation Schemas

### Equipment
```typescript
const equipmentSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0 veya daha büyük olmalı").default(0),
});
```

### Personnel
```typescript
const personnelSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  personnelTypeId: z.string().min(1, "Personel türü seçilmeli"),
  phone: turkishPhoneSchema,
  email: z.string().email("Geçerli bir email girin").optional().or(z.literal("")),
  salary: z.number().min(0, "Maaş 0 veya daha büyük olmalı").optional(),
  tcKimlikNo: tcKimlikOptionalSchema,
  address: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  workSchedule: z.string().optional(),
});
```

### Student Development
```typescript
const studentDevelopmentSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmeli"),
  date: z.string().min(1, "Tarih gerekli"),
  category: z.string().min(1, "Kategori seçilmeli"),
  metric: z.string().min(1, "Metrik seçilmeli"),
  score: z.number().min(1).max(10),
  notes: z.string().optional(),
  trainerId: z.string().optional(),
});
```

### Body Measurements
```typescript
const bodyMeasurementSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmeli"),
  date: z.string().min(1, "Tarih gerekli"),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  chestSize: z.number().min(0).optional(),
  waistSize: z.number().min(0).optional(),
  armSize: z.number().min(0).optional(),
  legSize: z.number().min(0).optional(),
  notes: z.string().optional(),
});
```

---

## Routes

### Equipment
- List: `/[locale]/settings/equipment`

### Personnel
- List: `/[locale]/personnel`
- Create: `/[locale]/personnel/new`
- Edit: `/[locale]/personnel/[id]/edit`

### Student Development
- List: `/[locale]/settings/student-development`

### Body Measurements
- List: `/[locale]/settings/body-measurements`
