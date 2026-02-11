import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { UserDto } from '../../models/admin.model';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <div class="header">
          <h1>Users</h1>
          <div class="search">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search users..." (keyup.enter)="search()" />
            <button (click)="search()">Search</button>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Friends</th>
                <th>Playlists</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge">{{ user.role }}</span></td>
                  <td>
                    <span class="status" [class.online]="user.isOnline">
                      {{ user.isOnline ? 'Online' : 'Offline' }}
                    </span>
                  </td>
                  <td>{{ user.friendsCount }}</td>
                  <td>{{ user.playlistsCount }}</td>
                  <td>
                    <button class="btn-danger" (click)="deleteUser(user)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="page() === 1">Prev</button>
          <span>Page {{ page() }}</span>
          <button (click)="nextPage()" [disabled]="users().length < pageSize">Next</button>
        </div>
      </div>
    </app-layout>
  `,
    styles: [`
    .page { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: #fff; margin: 0; }
    .search { display: flex; gap: 8px; }
    .search input {
      padding: 10px 16px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      background: rgba(0,0,0,0.2);
      color: #fff;
      width: 250px;
    }
    .search button {
      padding: 10px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .table-container {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { color: rgba(255,255,255,0.7); font-weight: 500; font-size: 13px; text-transform: uppercase; }
    td { color: #fff; }
    .badge { background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 4px 10px; border-radius: 12px; font-size: 12px; }
    .status { font-size: 13px; }
    .status.online { color: #4ade80; }
    .btn-danger {
      padding: 6px 12px;
      background: rgba(239,68,68,0.2);
      color: #fca5a5;
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .btn-danger:hover { background: rgba(239,68,68,0.3); }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
      color: rgba(255,255,255,0.7);
    }
    .pagination button {
      padding: 8px 16px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class UsersComponent implements OnInit {
    users = signal<UserDto[]>([]);
    page = signal(1);
    pageSize = 20;
    searchQuery = '';

    constructor(private adminService: AdminService) { }

    ngOnInit(): void { this.loadUsers(); }

    loadUsers(): void {
        this.adminService.getUsers(this.page(), this.pageSize, this.searchQuery || undefined).subscribe({
            next: (users) => this.users.set(users)
        });
    }

    search(): void {
        this.page.set(1);
        this.loadUsers();
    }

    prevPage(): void {
        if (this.page() > 1) {
            this.page.update(p => p - 1);
            this.loadUsers();
        }
    }

    nextPage(): void {
        this.page.update(p => p + 1);
        this.loadUsers();
    }

    deleteUser(user: UserDto): void {
        if (confirm(`Delete user "${user.username}"?`)) {
            this.adminService.deleteUser(user.id).subscribe({
                next: () => this.loadUsers()
            });
        }
    }
}
