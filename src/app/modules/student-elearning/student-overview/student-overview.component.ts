import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MyLearning, StudentLearningService } from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './student-overview.component.html',
  styleUrl: './student-overview.component.css',
})
export class StudentOverviewComponent implements OnInit {
  readonly loading = signal(true);
  readonly error = signal('');
  readonly learning = signal<MyLearning | null>(null);
  constructor(private readonly studentLearning: StudentLearningService) {}

  ngOnInit(): void {
    this.studentLearning.getMyLearning().subscribe({
      next: ({ data }) => { this.learning.set(data); this.loading.set(false); },
      error: (error) => { this.error.set(error?.error?.message ?? 'Không tải được dữ liệu học tập.'); this.loading.set(false); },
    });
  }

  get courses() { return this.learning()?.enrollments ?? []; }
  get assignments() { return this.learning()?.activities.filter((item) => item.kind === 'assignment') ?? []; }
  get schedules() { return this.learning()?.activities.filter((item) => item.kind === 'schedule').sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? '')) ?? []; }
  get pendingCount() { return this.assignments.filter((item) => !item.submission).length; }
  get averageProgress() {
    return this.courses.length ? Math.round(this.courses.reduce((total, item) => total + item.progress, 0) / this.courses.length) : 0;
  }
  get completedCount() { return this.courses.filter((item) => item.status === 'completed').length; }
}
