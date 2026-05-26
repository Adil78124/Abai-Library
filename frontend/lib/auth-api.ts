import { apiFetch } from './api';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
};

export async function login(email: string, password: string) {
  return apiFetch<PublicUser>('/auth/login', {
    method: 'POST',
    json: { email, password },
  });
}

export async function register(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) {
  return apiFetch<PublicUser>('/auth/register', {
    method: 'POST',
    json: { name, email, password, confirmPassword },
  });
}

export async function logout() {
  return apiFetch<{ success: true }>('/auth/logout', { method: 'POST' });
}

export async function getCurrentUser() {
  return apiFetch<PublicUser>('/auth/me', { method: 'GET' });
}

export type UpdateCurrentUserInput = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export async function updateCurrentUser(input: UpdateCurrentUserInput) {
  return apiFetch<PublicUser>('/auth/me', {
    method: 'PATCH',
    json: input,
  });
}
