export interface UserProfile {
  username: string;
  name: string;
  role: string;
  email: string;
}

const AUTH_KEY = 'ragsql_auth_session_v1';

export class AuthService {
  static isAuthenticated(): boolean {
    const raw = localStorage.getItem(AUTH_KEY);
    return !!raw;
  }

  static getUser(): UserProfile | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static login(username: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === 'testuser' && cleanPass === 'Password123') {
      const user: UserProfile = {
        username: 'testuser',
        name: 'testuser',
        role: 'Research User',
        email: 'testuser@university.edu'
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Use testuser / Password123' 
    };
  }

  static logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}
