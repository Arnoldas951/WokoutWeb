import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api/workouts';
import { ApiError } from '../api/client';
import { formatDate, formatDuration } from '../lib/format';
import type { Workout } from '../types/workout';

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
          <Link
            to={`/workouts/${workout.id}`}
            className="workout-card"
            key={workout.id ?? workout.name + workout.date}
          >
            <div className="workout-card-header">
              <h2>{workout.name}</h2>
              <span className="workout-duration">{formatDuration(workout.duration)}</span>
            </div>
            <p className="workout-date">{formatDate(workout.date)}</p>
            <p className="workout-exercise-count">
              {workout.exercises.length} exercise{workout.exercises.length === 1 ? '' : 's'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
