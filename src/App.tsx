import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { WorkoutDetailPage } from './pages/WorkoutDetailPage';
import { NewWorkoutPage } from './pages/NewWorkoutPage';
import { EditWorkoutPage } from './pages/EditWorkoutPage';

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/workouts" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workouts/new" element={<NewWorkoutPage />} />
            <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
            <Route path="/workouts/:id/edit" element={<EditWorkoutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/workouts" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
