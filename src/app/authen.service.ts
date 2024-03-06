import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserResponese } from '../../src/app/Modeldatabase/user_get';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'https://adv-voote.onrender.com/user/login'; // Update with your API endpoint

  private apiLoade = 'https://adv-voote.onrender.com';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly EMAIL_KEY = 'userEmail';
  private readonly PASSWORD_KEY = 'userPassword';
  constructor(private http: HttpClient) {}
  



  async login(email: string, password: string): Promise<UserResponese | null> {
    try {
      const response: any = await lastValueFrom(this.http.post(this.apiUrl, { email, password }));

      if (response && response.token) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.EMAIL_KEY, email); // Store email in localStorage
        localStorage.setItem(this.PASSWORD_KEY, password); // Store password in localStorage
        return response.user;
      }

      return null; // Return null when authentication fails
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  logout(): void {
    // Remove the token from localStorage on logout
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY); // Remove stored email on logout
    localStorage.removeItem(this.PASSWORD_KEY); // Remove stored password on logout
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  async initializeAuthentication(): Promise<UserResponese | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const storedEmail = localStorage.getItem(this.EMAIL_KEY);
    const storedPassword = localStorage.getItem(this.PASSWORD_KEY);

    if (token) {
      if (storedEmail && storedPassword) {
        // If stored email and password are available, use them for authentication
        const user = await this.login(storedEmail, storedPassword);
        return user;
      }

      // If no stored email and password, consider the user authenticated and load user data
      const user = await this.loadUserData(token);
      return user;
    }

    return null; // No token found, user not authenticated
  }



private async loadUserData(token: string): Promise<UserResponese | null> {
    try {
      const response: any = await this.http.get<UserResponese[]>(`${this.apiLoade}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      }).toPromise();

      const lastUser = response.length > 0 ? response[response.length - 1] : null;
      return lastUser;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }
  
  
}
