import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningActivity, StudentLearningService } from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css',
})
export class TeacherDashboardComponent implements OnInit {
  readonly activities = signal<LearningActivity[]>([]);
  readonly courseCount = signal(0);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private readonly learning: StudentLearningService) {}

  ngOnInit(): void {
    this.learning.getManageActivities().subscribe({
      next: ({ data }) => {
        this.activities.set(data.activities);
        this.courseCount.set(data.courses.length);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không tải được dữ liệu giảng dạy.');
        this.loading.set(false);
      },
    });
  }

  count(kind: LearningActivity['kind']): number {
    return this.activities().filter((item) => item.kind === kind).length;
  }

  get pendingSubmissions(): number {
    return this.activities().reduce((total, activity) => total + (activity.submissions?.filter((item) => item.score === undefined).length ?? 0), 0);
  }
}
