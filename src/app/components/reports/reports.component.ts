import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { SongReportDto } from '../../models/admin.model';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <div class="header">
          <h1>Reported Songs</h1>
          <div class="tabs">
            <button [class.active]="currentStatus() === 'Pending'" (click)="loadReports('Pending')">Pending</button>
            <button [class.active]="currentStatus() === 'Banned'" (click)="loadReports('Banned')">Banned</button>
            <button [class.active]="currentStatus() === 'Dismissed'" (click)="loadReports('Dismissed')">Dismissed</button>
          </div>
        </div>
        @if (reports().length === 0) {
          <div class="empty">No {{ currentStatus().toLowerCase() }} reports</div>
        }
        <div class="reports-list">
          @for (report of reports(); track report.id) {
            <div class="report-card">
              <div class="report-header">
                <div>
                  <h3>{{ report.songTitle }}</h3>
                  <span class="artist">by {{ report.artistName }}</span>
                </div>
                <span class="badge" [class]="'badge-' + report.reason.toLowerCase()">{{ report.reason }}</span>
              </div>
              <div class="report-meta">
                <span>Reported by: <strong>{{ report.reportedByUsername }}</strong></span>
                <span>{{ report.createdAt | date:'short' }}</span>
                <span>Plays: {{ report.totalPlays }}</span>
              </div>
              <p class="description">{{ report.description }}</p>
              @if (report.evidenceUrl) {
                <a class="evidence" [href]="report.evidenceUrl" target="_blank">View Evidence</a>
              }
              @if (currentStatus() === 'Pending') {
                <div class="actions">
                  <button class="btn-ban" (click)="banSong(report)">Ban Song</button>
                  <button class="btn-dismiss" (click)="dismissReport(report)">Dismiss</button>
                </div>
              }
            </div>
          }
        </div>
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="page() === 1">Prev</button>
          <span>Page {{ page() }}</span>
          <button (click)="nextPage()" [disabled]="reports().length < 20">Next</button>
        </div>
      </div>
    </app-layout>
  `,
    styles: [`
    .page { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    h1 { color: #fff; margin: 0; }
    .tabs { display: flex; gap: 8px; }
    .tabs button { padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.7); border-radius: 8px; cursor: pointer; }
    .tabs button.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border-color: transparent; }
    .empty { color: rgba(255,255,255,0.5); text-align: center; padding: 40px; }
    .reports-list { display: flex; flex-direction: column; gap: 16px; }
    .report-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
    .report-header { display: flex; justify-content: space-between; align-items: start; }
    .report-header h3 { color: #fff; margin: 0 0 4px; }
    .artist { color: rgba(255,255,255,0.6); font-size: 13px; }
    .badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-copyright { background: rgba(239,68,68,0.2); color: #fca5a5; }
    .badge-explicit { background: rgba(245,158,11,0.2); color: #fcd34d; }
    .badge-fake { background: rgba(139,92,246,0.2); color: #c4b5fd; }
    .badge-spam { background: rgba(59,130,246,0.2); color: #93c5fd; }
    .badge-other { background: rgba(107,114,128,0.2); color: #d1d5db; }
    .report-meta { display: flex; gap: 16px; color: rgba(255,255,255,0.5); font-size: 13px; margin: 12px 0; }
    .report-meta strong { color: rgba(255,255,255,0.8); }
    .description { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.5; margin: 8px 0; }
    .evidence { color: #818cf8; font-size: 13px; }
    .actions { display: flex; gap: 10px; margin-top: 16px; }
    .btn-ban { padding: 8px 20px; background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; cursor: pointer; }
    .btn-ban:hover { background: rgba(239,68,68,0.3); }
    .btn-dismiss { padding: 8px 20px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; }
    .btn-dismiss:hover { background: rgba(255,255,255,0.15); }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; color: rgba(255,255,255,0.7); }
    .pagination button { padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ReportsComponent implements OnInit {
    reports = signal<SongReportDto[]>([]);
    page = signal(1);
    currentStatus = signal('Pending');

    constructor(private adminService: AdminService) {}

    ngOnInit(): void { this.loadReports('Pending'); }

    loadReports(status: string): void {
        this.currentStatus.set(status);
        this.page.set(1);
        this.fetchReports();
    }

    fetchReports(): void {
        this.adminService.getReports(this.currentStatus(), this.page()).subscribe({
            next: (reports) => this.reports.set(reports)
        });
    }

    banSong(report: SongReportDto): void {
        if (confirm(`Ban song "${report.songTitle}"? This will hide it from all users.`)) {
            this.adminService.banSong(report.id).subscribe({
                next: () => this.fetchReports()
            });
        }
    }

    dismissReport(report: SongReportDto): void {
        this.adminService.dismissReport(report.id).subscribe({
            next: () => this.fetchReports()
        });
    }

    prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.fetchReports(); } }
    nextPage(): void { this.page.update(p => p + 1); this.fetchReports(); }
}
