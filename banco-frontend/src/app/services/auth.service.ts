import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  usuario: { id: number; email: string; rol: string; cliente_id: number | null; };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'banco_token';
  private readonly USER_KEY  = 'banco_user';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
      }));
  }

  register(data: { nombre: string; email: string; telefono?: string; password: string; }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken():   string | null { return localStorage.getItem(this.TOKEN_KEY); }
  getUser():    any { const u = localStorage.getItem(this.USER_KEY); return u ? JSON.parse(u) : null; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin():    boolean { return this.getUser()?.rol === 'admin'; }
}
