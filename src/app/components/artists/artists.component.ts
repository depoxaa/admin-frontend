import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { ArtistDto } from '../../models/admin.model';

@Component({
    selector: 'app-artists',
    standalone: true,
    imports: [CommonModule, FormsModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <div class="header">
          <h1>Artists</h1>
          <div class="search">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search artists..." (keyup.enter)="search()" />
            <button (click)="search()">Search</button>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Subscribers</th>
                <th>Songs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (artist of artists(); track artist.id) {
                <tr>
                  <td>{{ artist.name }}</td>
                  <td>{{ artist.genre || '-' }}</td>
                  <td>{{ artist.subscribersCount }}</td>
                  <td>{{ artist.songsCount }}</td>
                  <td>
                    <span class="status" [class.live]="artist.isLive">
                      {{ artist.isLive ? '🔴 Live' : 'Offline' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-danger" (click)="deleteArtist(artist)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="page() === 1">Prev</button>
          <span>Page {{ page() }}</span>
          <button (click)="nextPage()" [disabled]="artists().length < pageSize">Next</button>
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
    .status { font-size: 13px; }
    .status.live { color: #f87171; }
    .btn-danger { padding: 6px 12px; background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; cursor: pointer; font-size: 13px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; color: rgba(255,255,255,0.7); }
    .pagination button { padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ArtistsComponent implements OnInit {
    artists = signal<ArtistDto[]>([]);
    page = signal(1);
    pageSize = 20;
    searchQuery = '';

    constructor(private adminService: AdminService) { }

    ngOnInit(): void { this.loadArtists(); }

    loadArtists(): void {
        this.adminService.getArtists(this.page(), this.pageSize, this.searchQuery || undefined).subscribe({
            next: (artists) => this.artists.set(artists)
        });
    }

    search(): void { this.page.set(1); this.loadArtists(); }
    prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.loadArtists(); } }
    nextPage(): void { this.page.update(p => p + 1); this.loadArtists(); }

    deleteArtist(artist: ArtistDto): void {
        if (confirm(`Delete artist "${artist.name}"?`)) {
            this.adminService.deleteArtist(artist.id).subscribe({ next: () => this.loadArtists() });
        }
    }
}
