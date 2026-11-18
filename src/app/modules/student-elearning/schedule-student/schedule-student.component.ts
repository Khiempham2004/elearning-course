import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LearningActivity, StudentLearningService } from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-schedule-student',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './schedule-student.component.html',
  styleUrl: './schedule-student.component.css'
})
export class ScheduleStudentComponent implements OnInit {
  readonly activities = signal<LearningActivity[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  constructor(private readonly learningService: StudentLearningService) {}
  ngOnInit(): void {
    this.learningService.getMyLearning().subscribe({
      next: ({ data }) => { this.activities.set(data.activities.filter((item) => item.kind === 'schedule').sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''))); this.loading.set(false); },
      error: (error) => { this.error.set(error?.error?.message ?? 'Không tải được lịch học.'); this.loading.set(false); },
    });
  }

  isUpcoming(item: LearningActivity): boolean {
    return !!item.startsAt && new Date(item.startsAt).getTime() >= Date.now();
  }

}
