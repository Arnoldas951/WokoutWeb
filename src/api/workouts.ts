import { apiRequest } from './client';
import type { Workout } from '../types/workout';

export function getWorkouts(): Promise<Workout[]> {
  return apiRequest<Workout[]>('/api/workout/workouts');
}

export function createWorkout(workout: Workout): Promise<Workout> {
  return apiRequest<Workout>('/api/workout', {
    method: 'POST',
    body: workout,
  });
}
