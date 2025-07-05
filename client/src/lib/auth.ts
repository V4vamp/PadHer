export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setAuthData = (token: string, user: User): void => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin" || user?.role === "content_manager";
};
