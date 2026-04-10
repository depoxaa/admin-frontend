import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { AdminService } from '../../services/admin.service';
import { PlatformSettingDto, UpdateSettingDto } from '../../models/admin.model';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, LayoutComponent],
    template: `
    <app-layout>
      <div class="page">
        <h1>Platform Limits</h1>
        <div class="settings-grid">
          @for (setting of settings(); track setting.key) {
            <div class="setting-card">
              <label>{{ formatLabel(setting.key) }}</label>
              <input type="text"
                     [value]="editValues[setting.key] ?? setting.value"
                     (input)="editValues[setting.key] = $any($event.target).value" />
              <span class="hint">{{ getHint(setting.key) }}</span>
            </div>
          }
        </div>
        @if (error()) {
          <div class="error">{{ error() }}</div>
        }
        @if (success()) {
          <div class="success">{{ success() }}</div>
        }
        <button class="save-btn" (click)="save()" [disabled]="saving()">
          {{ saving() ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </app-layout>
  `,
    styles: [`
    .page { padding: 24px; }
    h1 { color: #fff; margin: 0 0 24px; }
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .setting-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
    .setting-card label { display: block; color: rgba(255,255,255,0.7); font-size: 13px; text-transform: uppercase; margin-bottom: 8px; }
    .setting-card input { width: 100%; padding: 10px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(0,0,0,0.2); color: #fff; font-size: 16px; box-sizing: border-box; }
    .hint { display: block; color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 6px; }
    .save-btn { padding: 12px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
    .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { color: #fca5a5; background: rgba(239,68,68,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px; }
    .success { color: #86efac; background: rgba(34,197,94,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px; }
  `]
})
export class SettingsComponent implements OnInit {
    settings = signal<PlatformSettingDto[]>([]);
    saving = signal(false);
    error = signal('');
    success = signal('');
    editValues: { [key: string]: string | undefined } = {};

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.adminService.getSettings().subscribe({
            next: (settings) => {
                this.settings.set(settings);
                settings.forEach(s => this.editValues[s.key] = s.value);
            }
        });
    }

    formatLabel(key: string): string {
        return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    getHint(key: string): string {
        const hints: Record<string, string> = {
            'playlist_limit_ordinary': 'Max playlists for free users. Use -1 for unlimited.',
            'playlist_limit_premium': 'Max playlists for premium users. Use -1 for unlimited.',
            'stream_viewer_limit_ordinary': 'Max concurrent viewers for ordinary hosts.',
            'stream_viewer_limit_premium': 'Max concurrent viewers for premium hosts.',
            'premium_price_usd': 'Monthly price in USD for premium subscription.',
            'platform_commission_percent': 'Platform commission percentage on song sales (e.g., 12 = 12%).'
        };
        return hints[key] || '';
    }

    save(): void {
        this.saving.set(true);
        this.error.set('');
        this.success.set('');

        const updates: UpdateSettingDto[] = Object.entries(this.editValues)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => ({ key, value: value! }));

        this.adminService.updateSettings(updates).subscribe({
            next: () => {
                this.saving.set(false);
                this.success.set('Settings saved successfully');
                setTimeout(() => this.success.set(''), 3000);
            },
            error: (err) => {
                this.saving.set(false);
                this.error.set(err.error?.error || 'Failed to save settings');
            }
        });
    }
}
