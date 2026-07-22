import { apiRequest } from './client';
import type { Workout } from '../types/workout';

export function getWorkouts(): Promise<Workout[]> {
  return apiRequest<Workout[]>('/api/workout');
}

export function getWorkout(id: number | string): Promise<Workout> {
  return apiRequest<Workout>(`/api/workout/${id}`);
}

export function createWorkout(workout: Workout): Promise<Workout> {
  return apiRequest<Workout>('/api/workout', {
    method: 'POST',
    body: workout,
  });
}

export function updateWorkout(id: number | string, workout: Workout): Promise<void> {
  return apiRequest<void>(`/api/workout/${id}`, {
    method: 'PUT',
    body: workout,
  });
}

export function deleteWorkout(id: number | string): Promise<void> {
  return apiRequest<void>(`/api/workout/${id}`, {
    method: 'DELETE',
  });
}
