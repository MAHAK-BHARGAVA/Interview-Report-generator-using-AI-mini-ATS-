import axios from 'axios';

const api = axios.create({
  baseURL: 'https://interview-report-generator-and-analyzer.onrender.com',
  withCredentials: true,
});

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function register({name, email, password}: RegisterPayload)
{
    try{
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
}

export async function login({email, password}: LoginPayload) {
  try{
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error:any) {
      console.log(error.response);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
}

export async function logout() {
  try{
      await api.post('/api/auth/logout', {});
    } catch (error) {
      throw new Error('Logout failed');
    }
}

export async function getCurrentUser() {
  try {
    // No localStorage needed! Axios will automatically pass the HttpOnly cookie now.
    const response = await api.get('/api/auth/getme');
    
    // Check your backend response profile. If it returns the user directly:
    return response.data; 
    
    // If your backend nests it under a user key (like the login response), use this instead:
    // return response.data.user;
  } catch (error) {
    // Quietly return null if unauthenticated on boot up
    return null;
  }
}