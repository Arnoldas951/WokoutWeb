import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkout } from '../api/workouts';
import { ApiError } from '../api/client';
import type { Exercise } from '../types/workout';

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

export function NewWorkoutPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<ExerciseRow[]>([emptyExerciseRow()]);
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
      await createWorkout({
        name,
        date: `${date}:00`,
        duration: `${pad(hours)}:${pad(minutes)}:00`,
        description: description || undefined,
        exercises: exercises.map(({ key: _key, ...exercise }) => exercise),
      });
      navigate('/workouts');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create workout.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>New Workout</h1>
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
          {submitting ? 'Saving…' : 'Save Workout'}
        </button>
      </form>
    </div>
  );
}
