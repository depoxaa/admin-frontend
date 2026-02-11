import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card">
        <h1>🎵 Music Admin</h1>
        <p>Super Admin Panel</p>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="admin@email.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>
          @if (error()) {
            <div class="error">{{ error() }}</div>
          }
          <button type="submit" [disabled]="loading()">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    .login-card {
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    h1 { color: #fff; margin: 0 0 8px; font-size: 28px; }
    p { color: rgba(255,255,255,0.7); margin: 0 0 24px; }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      color: rgba(255,255,255,0.8);
      margin-bottom: 6px;
      font-size: 14px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      background: rgba(0,0,0,0.2);
      color: #fff;
      font-size: 16px;
      box-sizing: border-box;
    }
    input::placeholder { color: rgba(255,255,255,0.4); }
    input:focus {
      outline: none;
      border-color: #6366f1;
    }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    button:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error {
      background: rgba(239,68,68,0.2);
      color: #fca5a5;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
    email = '';
    password = '';
    loading = signal(false);
    error = signal<string | null>(null);

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        this.loading.set(true);
        this.error.set(null);

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
            }
        });
    }
}
