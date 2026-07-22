import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkoutForm } from '../components/WorkoutForm';
import { getWorkout, updateWorkout } from '../api/workouts';
import { ApiError } from '../api/client';
import type { Workout } from '../types/workout';

export function EditWorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

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

  async function handleSubmit(updated: Workout) {
    if (!id) return;
    await updateWorkout(id, updated);
    navigate(`/workouts/${id}`);
  }

  return (
    <div className="page">
      <h1>Edit Workout</h1>
      {loading && <p>Loading workout…</p>}
      {error && <p className="form-error">{error}</p>}
      {workout && (
        <WorkoutForm
          initialWorkout={workout}
          submitLabel="Update Workout"
          submittingLabel="Updating…"
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
