import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Users } from '../components/auth/users-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  // signup(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/signup`, data);
  // }

  signup(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.baseUrl}/signup`, user).pipe(
      tap(() => {
        console.log('Signup successful');
      })
    );
  }


  signin(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.baseUrl}/signin`, user).pipe(
      tap(() => {
        console.log('Signin successful');
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  } 

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<Users> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Users>(`${this.baseUrl}/current-user`, { headers });
  }

  getUsers(): Observable<Users>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Users>(`${this.baseUrl}/users`, { headers });
  }


}
