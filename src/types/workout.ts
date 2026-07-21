export interface Exercise {
  id?: number;
  name: string;
  repetitions: number;
  sets: number;
  weight: number;
  notes?: string;
}

export interface Workout {
  id?: number;
  name: string;
  date: string;
  duration: string;
  description?: string;
  exercises: Exercise[];
}
