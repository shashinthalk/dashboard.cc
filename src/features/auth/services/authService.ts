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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {

      //adminpassword
      //cmarquardt@example.net

      const response = await fetch('http://127.0.0.1:8000/api/v1/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        console.error('HTTP error:', response.status);
      } else {

        const data = await response.json();

        if(data.isActive == false){
          const authUser = {
            id: data.id,
            email: data.email,
            name: data.role
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('user', JSON.stringify(authUser));
          
          return {
            success: true,
            token: mockToken,
            user: authUser
          };
        }else{
          console.log("Account not activated")
          return {
            success: false,
            error: 'Account not activated'
          };
        }

      }
      console.log("Invalid email or password")
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