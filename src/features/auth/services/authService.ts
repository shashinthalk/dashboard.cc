interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

class AuthService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private readonly DEMO_EMAIL = process.env.REACT_APP_DEMO_EMAIL || 'admin@dashboard.com';
  private readonly DEMO_PASSWORD = process.env.REACT_APP_DEMO_PASSWORD || 'admin123';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // For demo purposes, check against environment variables
      if (credentials.email === this.DEMO_EMAIL && credentials.password === this.DEMO_PASSWORD) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: '1',
          email: credentials.email,
          name: 'Admin User'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store in localStorage
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return {
          success: true,
          token: mockToken,
          user: mockUser
        };
      }
      
      return {
        success: false,
        error: 'Invalid email or password'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
export type { LoginCredentials, AuthResponse }; 