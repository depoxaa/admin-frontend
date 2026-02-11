import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { PlaylistDto } from '../../models/admin.model';

@Component({
    selector: 'app-playlists',
    standalone: true,
    imports: [CommonModule, FormsModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <div class="header">
          <h1>Playlists</h1>
          <div class="search">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search playlists..." (keyup.enter)="search()" />
            <button (click)="search()">Search</button>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Owner</th><th>Status</th><th>Tracks</th><th>Views</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (playlist of playlists(); track playlist.id) {
                <tr>
                  <td>{{ playlist.name }}</td>
                  <td>{{ playlist.ownerUsername }}</td>
                  <td><span class="badge" [class.private]="playlist.status === 'Private'">{{ playlist.status }}</span></td>
                  <td>{{ playlist.tracksCount }}</td>
                  <td>{{ playlist.viewCount }}</td>
                  <td><button class="btn-danger" (click)="deletePlaylist(playlist)">Delete</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="page() === 1">Prev</button>
          <span>Page {{ page() }}</span>
          <button (click)="nextPage()" [disabled]="playlists().length < pageSize">Next</button>
        </div>
      </div>
    </app-layout>
  `,
    styles: [`
    .page { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: #fff; margin: 0; }
    .search { display: flex; gap: 8px; }
    .search input { padding: 10px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(0,0,0,0.2); color: #fff; width: 250px; }
    .search button { padding: 10px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 8px; cursor: pointer; }
    .table-container { background: rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { color: rgba(255,255,255,0.7); font-weight: 500; font-size: 13px; text-transform: uppercase; }
    td { color: #fff; }
    .badge { background: rgba(74,222,128,0.2); color: #4ade80; padding: 4px 10px; border-radius: 12px; font-size: 12px; }
    .badge.private { background: rgba(251,146,60,0.2); color: #fb923c; }
    .btn-danger { padding: 6px 12px; background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; cursor: pointer; font-size: 13px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; color: rgba(255,255,255,0.7); }
    .pagination button { padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class PlaylistsComponent implements OnInit {
    playlists = signal<PlaylistDto[]>([]);
    page = signal(1);
    pageSize = 20;
    searchQuery = '';

    constructor(private adminService: AdminService) { }

    ngOnInit(): void { this.loadPlaylists(); }

    loadPlaylists(): void {
        this.adminService.getPlaylists(this.page(), this.pageSize, this.searchQuery || undefined).subscribe({
            next: (playlists) => this.playlists.set(playlists)
        });
    }

    search(): void { this.page.set(1); this.loadPlaylists(); }
    prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.loadPlaylists(); } }
    nextPage(): void { this.page.update(p => p + 1); this.loadPlaylists(); }

    deletePlaylist(playlist: PlaylistDto): void {
        if (confirm(`Delete playlist "${playlist.name}"?`)) {
            this.adminService.deletePlaylist(playlist.id).subscribe({ next: () => this.loadPlaylists() });
        }
    }
}
