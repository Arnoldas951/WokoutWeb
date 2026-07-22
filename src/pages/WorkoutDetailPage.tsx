import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteWorkout, getWorkout } from '../api/workouts';
import { ApiError } from '../api/client';
import { formatDate, formatDuration } from '../lib/format';
import type { Workout } from '../types/workout';

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    getWorkout(id)
      .then((data) => {
        if (!cancelled) setWorkout(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Unable to load workout.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm('Delete this workout? This cannot be undone.')) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteWorkout(id);
      navigate('/workouts');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to delete workout.');
      setDeleting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/workouts" className="back-link">
        ← Back to workouts
      </Link>

      {loading && <p>Loading workout…</p>}
      {error && <p className="form-error">{error}</p>}

      {workout && (
        <>
          <div className="page-header">
            <h1>{workout.name}</h1>
            <div className="detail-actions">
              <Link to={`/workouts/${id}/edit`} className="button secondary">
                Edit
              </Link>
              <button type="button" className="button danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
          <p className="workout-date">
            {formatDate(workout.date)} · {formatDuration(workout.duration)}
          </p>
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
        </>
      )}
    </div>
  );
}
