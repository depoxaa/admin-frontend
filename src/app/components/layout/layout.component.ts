import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="logo">🎵 Music Admin</div>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard</a>
          <a routerLink="/users" routerLinkActive="active">👥 Users</a>
          <a routerLink="/artists" routerLinkActive="active">🎤 Artists</a>
          <a routerLink="/songs" routerLinkActive="active">🎵 Songs</a>
          <a routerLink="/playlists" routerLinkActive="active">📋 Playlists</a>
        </nav>
        <div class="user-section">
          <div class="user-info">
            <span class="username">{{ authService.user()?.username }}</span>
            <span class="role">Super Admin</span>
          </div>
          <button class="logout-btn" (click)="authService.logout()">Logout</button>
        </div>
      </aside>
      <main class="content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
    styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    .sidebar {
      width: 240px;
      background: rgba(0,0,0,0.3);
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      padding: 16px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 20px;
    }
    nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    nav a {
      display: block;
      padding: 12px 16px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }
    nav a:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    nav a.active {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
    }
    .user-section {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 16px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }
    .username { color: #fff; font-weight: 500; }
    .role { color: rgba(255,255,255,0.5); font-size: 12px; }
    .logout-btn {
      width: 100%;
      padding: 10px;
      background: rgba(239,68,68,0.2);
      color: #fca5a5;
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px;
      cursor: pointer;
    }
    .logout-btn:hover {
      background: rgba(239,68,68,0.3);
    }
    .content {
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
    constructor(public authService: AuthService) { }
}
