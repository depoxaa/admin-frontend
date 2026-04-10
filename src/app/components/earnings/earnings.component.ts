import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { ArtistEarningsDto, EarningsSummaryDto, WithdrawalDto } from '../../models/admin.model';

@Component({
    selector: 'app-earnings',
    standalone: true,
    imports: [CommonModule, FormsModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <h1>Artist Earnings</h1>

        <!-- Summary Cards -->
        @if (summary()) {
        <div class="summary-grid">
          <div class="summary-card">
            <span class="label">Total Revenue</span>
            <span class="value">\${{ summary()!.totalRevenue.toFixed(2) }}</span>
          </div>
          <div class="summary-card platform">
            <span class="label">Platform Commission ({{ summary()!.commissionPercent }}%)</span>
            <span class="value">\${{ summary()!.platformCommission.toFixed(2) }}</span>
          </div>
          <div class="summary-card">
            <span class="label">Artist Earnings</span>
            <span class="value">\${{ summary()!.totalArtistEarnings.toFixed(2) }}</span>
          </div>
          <div class="summary-card">
            <span class="label">Withdrawn</span>
            <span class="value">\${{ summary()!.totalWithdrawn.toFixed(2) }}</span>
          </div>
          <div class="summary-card warning">
            <span class="label">Pending Withdrawals</span>
            <span class="value">\${{ summary()!.pendingWithdrawals.toFixed(2) }}</span>
          </div>
        </div>
        }

        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="activeTab() === 'artists'" (click)="activeTab.set('artists')">Artist Earnings</button>
          <button [class.active]="activeTab() === 'withdrawals'" (click)="switchToWithdrawals()">
            Withdrawals
            @if (pendingCount() > 0) {
              <span class="badge">{{ pendingCount() }}</span>
            }
          </button>
        </div>

        <!-- Artist Earnings Tab -->
        @if (activeTab() === 'artists') {
        <div class="search-bar">
          <input type="text" placeholder="Search artists..." [ngModel]="artistSearch()" (ngModelChange)="searchArtists($event)" />
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Songs</th>
                <th>Total Revenue</th>
                <th>Commission</th>
                <th>Net Earnings</th>
                <th>Withdrawn</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              @for (artist of artists(); track artist.artistId) {
              <tr>
                <td class="artist-cell">
                  <strong>{{ artist.artistName }}</strong>
                  <span class="email">{{ artist.email }}</span>
                </td>
                <td>{{ artist.songsCount }}</td>
                <td>\${{ artist.totalRevenue.toFixed(2) }}</td>
                <td class="commission">\${{ artist.platformCommission.toFixed(2) }}</td>
                <td>\${{ artist.artistNetEarnings.toFixed(2) }}</td>
                <td>\${{ artist.withdrawnAmount.toFixed(2) }}</td>
                <td class="available">\${{ artist.availableBalance.toFixed(2) }}</td>
              </tr>
              }
              @empty {
              <tr><td colspan="7" class="empty">No artist earnings data</td></tr>
              }
            </tbody>
          </table>
        </div>
        }

        <!-- Withdrawals Tab -->
        @if (activeTab() === 'withdrawals') {
        <div class="withdrawal-filters">
          <button [class.active]="withdrawalStatus() === 'Pending'" (click)="loadWithdrawals('Pending')">Pending</button>
          <button [class.active]="withdrawalStatus() === 'Approved'" (click)="loadWithdrawals('Approved')">Approved</button>
          <button [class.active]="withdrawalStatus() === 'Rejected'" (click)="loadWithdrawals('Rejected')">Rejected</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Amount</th>
                <th>Card Number</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (w of withdrawals(); track w.id) {
              <tr>
                <td>{{ w.artistName }}</td>
                <td>\${{ w.amount.toFixed(2) }}</td>
                <td class="card-number">{{ w.cardNumber }}</td>
                <td>
                  <span class="status-badge" [class]="w.status.toLowerCase()">{{ w.status }}</span>
                </td>
                <td>{{ w.createdAt | date:'medium' }}</td>
                <td>
                  @if (w.status === 'Pending') {
                  <button class="approve-btn" (click)="approveWithdrawal(w.id)">Approve</button>
                  <button class="reject-btn" (click)="rejectWithdrawal(w.id)">Reject</button>
                  } @else {
                  <span class="reviewed">{{ w.reviewedAt | date:'short' }}</span>
                  }
                </td>
              </tr>
              }
              @empty {
              <tr><td colspan="6" class="empty">No {{ withdrawalStatus().toLowerCase() }} withdrawals</td></tr>
              }
            </tbody>
          </table>
        </div>
        }
      </div>
    </app-layout>
  `,
    styles: [`
    .page { padding: 24px; }
    h1 { color: #fff; margin: 0 0 24px; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .summary-card {
      background: rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 16px;
      .label { display: block; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
      .value { font-size: 22px; font-weight: 700; color: #fff; }
      &.platform .value { color: #818cf8; }
      &.warning .value { color: #fbbf24; }
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      button {
        padding: 10px 20px;
        background: rgba(255,255,255,0.08);
        border: none;
        border-radius: 8px;
        color: rgba(255,255,255,0.6);
        cursor: pointer;
        font-size: 14px;
        &.active { background: rgba(99,102,241,0.3); color: #fff; }
      }
      .badge {
        background: #ef4444;
        color: #fff;
        border-radius: 50%;
        padding: 2px 7px;
        font-size: 11px;
        margin-left: 6px;
      }
    }

    .search-bar {
      margin-bottom: 16px;
      input {
        width: 100%;
        max-width: 400px;
        padding: 10px 16px;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        background: rgba(0,0,0,0.2);
        color: #fff;
        font-size: 14px;
        box-sizing: border-box;
        &::placeholder { color: rgba(255,255,255,0.3); }
      }
    }

    .withdrawal-filters {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
      button {
        padding: 6px 14px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: rgba(255,255,255,0.5);
        cursor: pointer;
        font-size: 13px;
        &.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #fff; }
      }
    }

    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 10px 12px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
    td { padding: 12px; color: rgba(255,255,255,0.85); font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }

    .artist-cell { display: flex; flex-direction: column; gap: 2px;
      strong { color: #fff; }
      .email { color: rgba(255,255,255,0.4); font-size: 12px; }
    }
    .commission { color: #818cf8; }
    .available { color: #86efac; font-weight: 600; }
    .card-number { font-family: monospace; color: rgba(255,255,255,0.6); }
    .empty { text-align: center; color: rgba(255,255,255,0.3); padding: 32px; }

    .status-badge {
      padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;
      &.pending { background: rgba(251,191,36,0.2); color: #fbbf24; }
      &.approved { background: rgba(34,197,94,0.2); color: #86efac; }
      &.rejected { background: rgba(239,68,68,0.2); color: #fca5a5; }
      &.completed { background: rgba(99,102,241,0.2); color: #a5b4fc; }
    }

    .approve-btn, .reject-btn {
      padding: 5px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 6px;
    }
    .approve-btn { background: rgba(34,197,94,0.2); color: #86efac; &:hover { background: rgba(34,197,94,0.4); } }
    .reject-btn { background: rgba(239,68,68,0.2); color: #fca5a5; &:hover { background: rgba(239,68,68,0.4); } }
    .reviewed { color: rgba(255,255,255,0.4); font-size: 12px; }
  `]
})
export class EarningsComponent implements OnInit {
    summary = signal<EarningsSummaryDto | null>(null);
    artists = signal<ArtistEarningsDto[]>([]);
    withdrawals = signal<WithdrawalDto[]>([]);
    activeTab = signal<'artists' | 'withdrawals'>('artists');
    withdrawalStatus = signal('Pending');
    artistSearch = signal('');
    pendingCount = signal(0);

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.adminService.getEarningsSummary().subscribe({
            next: (s) => this.summary.set(s)
        });
        this.adminService.getArtistEarnings().subscribe({
            next: (a) => this.artists.set(a)
        });
        this.adminService.getPendingWithdrawalsCount().subscribe({
            next: (c) => this.pendingCount.set(c)
        });
    }

    searchArtists(query: string): void {
        this.artistSearch.set(query);
        this.adminService.getArtistEarnings(1, 20, query || undefined).subscribe({
            next: (a) => this.artists.set(a)
        });
    }

    switchToWithdrawals(): void {
        this.activeTab.set('withdrawals');
        this.loadWithdrawals('Pending');
    }

    loadWithdrawals(status: string): void {
        this.withdrawalStatus.set(status);
        this.adminService.getWithdrawals(status).subscribe({
            next: (w) => this.withdrawals.set(w)
        });
    }

    approveWithdrawal(id: string): void {
        this.adminService.approveWithdrawal(id).subscribe({
            next: () => {
                this.loadWithdrawals('Pending');
                this.pendingCount.update(c => Math.max(0, c - 1));
                this.refreshSummary();
            }
        });
    }

    rejectWithdrawal(id: string): void {
        this.adminService.rejectWithdrawal(id).subscribe({
            next: () => {
                this.loadWithdrawals('Pending');
                this.pendingCount.update(c => Math.max(0, c - 1));
                this.refreshSummary();
            }
        });
    }

    private refreshSummary(): void {
        this.adminService.getEarningsSummary().subscribe({
            next: (s) => this.summary.set(s)
        });
    }
}
