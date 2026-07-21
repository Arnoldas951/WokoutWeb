import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api/workouts';
import { ApiError } from '../api/client';
import type { Workout } from '../types/workout';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatDuration(value: string): string {
  const [hours, minutes] = value.split(':');
  if (hours === undefined || minutes === undefined) return value;
  const parts = [];
  if (Number(hours) > 0) parts.push(`${Number(hours)}h`);
  if (Number(minutes) > 0) parts.push(`${Number(minutes)}m`);
  return parts.length > 0 ? parts.join(' ') : '0m';
}

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getWorkouts()
      .then((data) => {
        if (!cancelled) setWorkouts(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Unable to load workouts.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Workouts</h1>
        <Link to="/workouts/new" className="button">
          New Workout
        </Link>
      </div>

      {loading && <p>Loading workouts…</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && workouts.length === 0 && (
        <p>No workouts yet. Create your first one.</p>
      )}

      <div className="workout-list">
        {workouts.map((workout) => (
          <div className="workout-card" key={workout.id ?? workout.name + workout.date}>
            <div className="workout-card-header">
              <h2>{workout.name}</h2>
              <span className="workout-duration">{formatDuration(workout.duration)}</span>
            </div>
            <p className="workout-date">{formatDate(workout.date)}</p>
            {workout.description && <p className="workout-description">{workout.description}</p>}

            {workout.exercises.length > 0 && (
              <table className="exercise-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((exercise, index) => (
                    <tr key={exercise.id ?? index}>
                      <td>{exercise.name}</td>
                      <td>{exercise.sets}</td>
                      <td>{exercise.repetitions}</td>
                      <td>{exercise.weight}</td>
                      <td>{exercise.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
