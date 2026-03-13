"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTrainingPlanAction,
  updateTrainingPlanAction,
  type TrainingFormState,
} from "@/lib/actions/training";

interface TrainingPlanFormProps {
  plan?: {
    id: string;
    title: string;
    description: string | null;
    date: Date | null;
    duration: number;
    focusArea: string | null;
    difficulty: string;
    status: string;
    targetAgeMin: number | null;
    targetAgeMax: number | null;
  };
  dictionary: {
    plans: Record<string, unknown>;
    common: Record<string, string>;
  };
}

export function TrainingPlanForm({ plan, dictionary }: TrainingPlanFormProps) {
  const isEditing = !!plan;
  const initialState: TrainingFormState = { errors: {}, message: "", success: false };

  const boundAction = isEditing
    ? updateTrainingPlanAction.bind(null, plan.id)
    : createTrainingPlanAction;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const focusAreas = (dictionary.plans.focusAreas || {}) as Record<string, string>;
  const difficulties = (dictionary.plans.difficulties || {}) as Record<string, string>;
  const statuses = (dictionary.plans.statuses || {}) as Record<string, string>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing
            ? (dictionary.plans as Record<string, string>).editPlan || "Edit Plan"
            : (dictionary.plans as Record<string, string>).addPlan || "New Plan"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{dictionary.common.name || "Title"}</Label>
            <Input
              id="title"
              name="title"
              defaultValue={plan?.title || ""}
              required
            />
            {state.errors?.title && (
              <p className="text-xs text-destructive">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {(dictionary.plans as Record<string, string>).exerciseDescription || "Description"}
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={plan?.description || ""}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">{(dictionary.plans as Record<string, string>).date || "Date"}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={plan?.date ? new Date(plan.date).toISOString().split("T")[0] : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{(dictionary.plans as Record<string, string>).duration || "Duration"} (min)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={plan?.duration || 90}
                min="15"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <Label>{(dictionary.plans as Record<string, string>).focusArea || "Focus Area"}</Label>
              <Select name="focusArea" defaultValue={plan?.focusArea || ""}>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.common.select || "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(focusAreas).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{(dictionary.plans as Record<string, string>).difficulty || "Difficulty"}</Label>
              <Select name="difficulty" defaultValue={plan?.difficulty || "INTERMEDIATE"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(difficulties).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{(dictionary.plans as Record<string, string>).status || "Status"}</Label>
              <Select name="status" defaultValue={plan?.status || "DRAFT"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statuses).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetAgeMin">{(dictionary.plans as Record<string, string>).ageMin || "Min Age"}</Label>
              <Input
                id="targetAgeMin"
                name="targetAgeMin"
                type="number"
                defaultValue={plan?.targetAgeMin || ""}
                min="4"
                max="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAgeMax">{(dictionary.plans as Record<string, string>).ageMax || "Max Age"}</Label>
              <Input
                id="targetAgeMax"
                name="targetAgeMax"
                type="number"
                defaultValue={plan?.targetAgeMax || ""}
                min="4"
                max="25"
              />
            </div>
          </div>

          {state.message && (
            <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
              {state.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? (dictionary.common.loading || "Loading...")
                : isEditing
                ? (dictionary.common.update || "Update")
                : (dictionary.common.save || "Save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
