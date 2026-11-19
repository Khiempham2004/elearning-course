import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardData, DashboardService } from '../../../core/services/Dashboard.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  readonly dashboard = signal<AdminDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: ({ data }) => { this.dashboard.set(data); this.loading.set(false); },
      error: (error) => { this.error.set(error?.error?.message ?? 'Không tải được dashboard.'); this.loading.set(false); },
    });
  }

  get maxStudents(): number {
    return Math.max(1, ...(this.dashboard()?.studentTrend.map((item) => item.count) ?? [0]));
  }

  barHeight(value: number): number {
    return value === 0 ? 3 : Math.max(8, Math.round((value / this.maxStudents) * 100));
  }
}
