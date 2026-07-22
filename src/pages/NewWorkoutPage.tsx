import { useNavigate } from 'react-router-dom';
import { WorkoutForm } from '../components/WorkoutForm';
import { createWorkout } from '../api/workouts';
import type { Workout } from '../types/workout';

export function NewWorkoutPage() {
  const navigate = useNavigate();

  async function handleSubmit(workout: Workout) {
    await createWorkout(workout);
    navigate('/workouts');
  }

  return (
    <div className="page">
      <h1>New Workout</h1>
      <WorkoutForm
        submitLabel="Save Workout"
        submittingLabel="Saving…"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
