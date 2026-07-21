import { apiRequest, setToken } from './client';
import type { AuthCredentials, LoginResponse } from '../types/auth';

export async function register(credentials: AuthCredentials): Promise<void> {
  await apiRequest<void>('/api/auth/register', {
    method: 'POST',
    body: credentials,
    auth: false,
  });
}

export async function login(credentials: AuthCredentials): Promise<void> {
  const data = await apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  });
  setToken(data.token);
}
