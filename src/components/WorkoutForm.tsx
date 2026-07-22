import { useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import { durationToHoursMinutes, isoToDatetimeLocal } from '../lib/format';
import type { Exercise, Workout } from '../types/workout';

interface ExerciseRow extends Exercise {
  key: string;
}

function emptyExerciseRow(): ExerciseRow {
  return {
    key: crypto.randomUUID(),
    name: '',
    repetitions: 0,
    sets: 0,
    weight: 0,
    notes: '',
  };
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function exerciseRowsFrom(workout: Workout | undefined): ExerciseRow[] {
  if (!workout || workout.exercises.length === 0) return [emptyExerciseRow()];
  return workout.exercises.map((exercise) => ({ ...exercise, key: crypto.randomUUID() }));
}

interface WorkoutFormProps {
  initialWorkout?: Workout;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (workout: Workout) => Promise<void>;
}

export function WorkoutForm({
  initialWorkout,
  submitLabel,
  submittingLabel,
  onSubmit,
}: WorkoutFormProps) {
  const initialDuration = durationToHoursMinutes(initialWorkout?.duration ?? '00:00:00');

  const [name, setName] = useState(initialWorkout?.name ?? '');
  const [date, setDate] = useState(
    initialWorkout ? isoToDatetimeLocal(initialWorkout.date) : '',
  );
  const [hours, setHours] = useState(initialDuration.hours);
  const [minutes, setMinutes] = useState(initialDuration.minutes);
  const [description, setDescription] = useState(initialWorkout?.description ?? '');
  const [exercises, setExercises] = useState<ExerciseRow[]>(exerciseRowsFrom(initialWorkout));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateExercise(key: string, field: keyof Exercise, value: string) {
    setExercises((rows) =>
      rows.map((row) => {
        if (row.key !== key) return row;
        if (field === 'name' || field === 'notes') {
          return { ...row, [field]: value };
        }
        return { ...row, [field]: Number(value) };
      }),
    );
  }

  function addExerciseRow() {
    setExercises((rows) => [...rows, emptyExerciseRow()]);
  }

  function removeExerciseRow(key: string) {
    setExercises((rows) => rows.filter((row) => row.key !== key));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!date) {
      setError('Please choose a date and time.');
      return;
    }
    if (exercises.length === 0) {
      setError('Add at least one exercise.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: initialWorkout?.id,
        name,
        date: `${date}:00`,
        duration: `${pad(hours)}:${pad(minutes)}:00`,
        description: description || undefined,
        exercises: exercises.map(({ key: _key, ...exercise }) => exercise),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to save workout.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="date">Date &amp; time</label>
      <input
        id="date"
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label>Duration</label>
      <div className="duration-inputs">
        <input
          type="number"
          min={0}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          aria-label="Hours"
        />
        <span>hours</span>
        <input
          type="number"
          min={0}
          max={59}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          aria-label="Minutes"
        />
        <span>minutes</span>
      </div>

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <h2>Exercises</h2>
      <div className="exercise-rows">
        <div className="exercise-row exercise-row-header" aria-hidden="true">
          <span>Exercise</span>
          <span>Sets</span>
          <span>Reps</span>
          <span>Weight</span>
          <span>Notes</span>
          <span></span>
        </div>
        {exercises.map((exercise) => (
          <div className="exercise-row" key={exercise.key}>
            <input
              type="text"
              placeholder="Exercise name"
              value={exercise.name}
              onChange={(e) => updateExercise(exercise.key, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              min={0}
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => updateExercise(exercise.key, 'sets', e.target.value)}
              aria-label="Sets"
            />
            <input
              type="number"
              min={0}
              placeholder="Reps"
              value={exercise.repetitions}
              onChange={(e) => updateExercise(exercise.key, 'repetitions', e.target.value)}
              aria-label="Repetitions"
            />
            <input
              type="number"
              min={0}
              step="0.5"
              placeholder="Weight"
              value={exercise.weight}
              onChange={(e) => updateExercise(exercise.key, 'weight', e.target.value)}
              aria-label="Weight"
            />
            <input
              type="text"
              placeholder="Notes"
              value={exercise.notes}
              onChange={(e) => updateExercise(exercise.key, 'notes', e.target.value)}
            />
            <button
              type="button"
              className="link-button remove-row"
              onClick={() => removeExerciseRow(exercise.key)}
              disabled={exercises.length === 1}
              aria-label="Remove exercise"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="button secondary" onClick={addExerciseRow}>
        Add Exercise
      </button>

      <button type="submit" disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
