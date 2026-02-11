import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { DashboardStatsDto } from '../../models/admin.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="dashboard">
        <h1>Dashboard</h1>
        @if (stats()) {
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-value">{{ stats()!.totalUsers }}</div>
              <div class="stat-label">Total Users</div>
              <div class="stat-sub">{{ stats()!.onlineUsers }} online</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎤</div>
              <div class="stat-value">{{ stats()!.totalArtists }}</div>
              <div class="stat-label">Total Artists</div>
              <div class="stat-sub">{{ stats()!.liveArtists }} live</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎵</div>
              <div class="stat-value">{{ stats()!.totalSongs }}</div>
              <div class="stat-label">Total Songs</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📋</div>
              <div class="stat-value">{{ stats()!.totalPlaylists }}</div>
              <div class="stat-label">Total Playlists</div>
            </div>
          </div>
          <div class="lists-grid">
            <div class="list-card">
              <h3>Recent Users</h3>
              <ul>
                @for (user of stats()!.recentUsers; track user.email) {
                  <li>
                    <span class="name">{{ user.username }}</span>
                    <span class="email">{{ user.email }}</span>
                  </li>
                }
              </ul>
            </div>
            <div class="list-card">
              <h3>Top Artists</h3>
              <ul>
                @for (artist of stats()!.topArtists; track artist.name) {
                  <li>
                    <span class="name">{{ artist.name }}</span>
                    <span class="subscribers">{{ artist.subscribersCount }} subscribers</span>
                  </li>
                }
              </ul>
            </div>
          </div>
        } @else {
          <div class="loading">Loading...</div>
        }
      </div>
    </app-layout>
  `,
    styles: [`
    .dashboard { padding: 24px; }
    h1 { color: #fff; margin: 0 0 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }
    .stat-icon { font-size: 32px; margin-bottom: 8px; }
    .stat-value { font-size: 36px; font-weight: 700; color: #fff; }
    .stat-label { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 4px; }
    .stat-sub { color: #4ade80; font-size: 12px; margin-top: 4px; }
    .lists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .list-card {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
    }
    .list-card h3 { color: #fff; margin: 0 0 16px; font-size: 16px; }
    .list-card ul { list-style: none; padding: 0; margin: 0; }
    .list-card li {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .list-card li:last-child { border-bottom: none; }
    .name { color: #fff; font-weight: 500; }
    .email, .subscribers { color: rgba(255,255,255,0.6); font-size: 13px; }
    .loading { color: rgba(255,255,255,0.6); text-align: center; padding: 40px; }
  `]
})
export class DashboardComponent implements OnInit {
    stats = signal<DashboardStatsDto | null>(null);

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.adminService.getDashboardStats().subscribe({
            next: (stats) => this.stats.set(stats),
            error: (err) => console.error('Failed to load stats', err)
        });
    }
}
