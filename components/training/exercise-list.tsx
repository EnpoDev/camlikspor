"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Clock } from "lucide-react";
import { createExerciseAction, deleteExerciseAction } from "@/lib/actions/training";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  equipment: string | null;
  orderIndex: number;
}

interface ExerciseListProps {
  planId: string;
  exercises: Exercise[];
  dictionary: Record<string, string>;
}

export function ExerciseList({ planId, exercises: initialExercises, dictionary }: ExerciseListProps) {
  const [exercises, setExercises] = useState(initialExercises);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("15");
  const [equipment, setEquipment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);

    const result = await createExerciseAction({
      planId,
      name,
      description: description || undefined,
      duration: parseInt(duration) || 15,
      equipment: equipment || undefined,
      orderIndex: exercises.length,
    });

    if (result.success) {
      // Optimistic update - will be re-rendered on revalidation
      setExercises((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name,
          description: description || null,
          duration: parseInt(duration) || 15,
          equipment: equipment || null,
          orderIndex: exercises.length,
        },
      ]);
      setName("");
      setDescription("");
      setDuration("15");
      setEquipment("");
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteExerciseAction(id, planId);
    if (result.success) {
      setExercises((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{dictionary.exercises || "Exercises"}</h3>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.addExercise || "Add Exercise"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2">
              <Label>{dictionary.exerciseName || "Exercise Name"}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{dictionary.exerciseDescription || "Description"}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{dictionary.duration || "Duration"} (min)</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" />
              </div>
              <div className="space-y-2">
                <Label>{dictionary.equipment || "Equipment"}</Label>
                <Input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="cones, balls..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={isSubmitting} size="sm">
                {dictionary.addExercise || "Add"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                {dictionary.cancel || "Cancel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {dictionary.noExercises || "No exercises yet. Add your first exercise."}
        </p>
      ) : (
        <div className="space-y-2">
          {exercises.map((exercise, idx) => (
            <Card key={exercise.id}>
              <CardContent className="flex items-start gap-3 py-3 px-4">
                <GripVertical className="mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    <span className="font-medium text-sm">{exercise.name}</span>
                  </div>
                  {exercise.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {exercise.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {exercise.duration} min
                    </span>
                    {exercise.equipment && <span>{exercise.equipment}</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(exercise.id)}
                  className="text-destructive hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
