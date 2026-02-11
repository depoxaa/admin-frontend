import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AdminLoginDto, AdminTokenResponse } from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenKey = 'admin_token';
    private userKey = 'admin_user';

    token = signal<string | null>(localStorage.getItem(this.tokenKey));
    user = signal<{ username: string; email: string } | null>(
        JSON.parse(localStorage.getItem(this.userKey) || 'null')
    );

    isAuthenticated = computed(() => !!this.token());

    constructor(private http: HttpClient, private router: Router) { }

    login(dto: AdminLoginDto): Observable<AdminTokenResponse> {
        return this.http.post<AdminTokenResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
            tap(response => {
                localStorage.setItem(this.tokenKey, response.token);
                localStorage.setItem(this.userKey, JSON.stringify({
                    username: response.username,
                    email: response.email
                }));
                this.token.set(response.token);
                this.user.set({ username: response.username, email: response.email });
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.token.set(null);
        this.user.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return this.token();
    }
}
