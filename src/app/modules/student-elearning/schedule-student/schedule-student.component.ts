import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LearningActivity, StudentLearningService } from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-schedule-student',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './schedule-student.component.html',
  styleUrl: './schedule-student.component.css'
})
export class ScheduleStudentComponent implements OnInit {
  readonly activities = signal<LearningActivity[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly hasCourses = signal(false);
  constructor(private readonly learningService: StudentLearningService) {}
  ngOnInit(): void {
    this.learningService.getMyLearning().subscribe({
      next: ({ data }) => { this.hasCourses.set(data.enrollments.length > 0); this.activities.set(data.activities.filter((item) => item.kind === 'schedule').sort((a, b) => { const aTime = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER; const bTime = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER; const now = Date.now(); const aPast = aTime < now; const bPast = bTime < now; return aPast === bPast ? (aPast ? bTime - aTime : aTime - bTime) : Number(aPast) - Number(bPast); })); this.loading.set(false); },
      error: (error) => { this.error.set(error?.error?.message ?? 'Không tải được lịch học.'); this.loading.set(false); },
    });
  }

  isUpcoming(item: LearningActivity): boolean {
    return !!item.startsAt && new Date(item.startsAt).getTime() >= Date.now();
  }

  timeStatus(item: LearningActivity): string {
    if (!item.startsAt) return 'Chưa xếp thời gian';
    return this.isUpcoming(item) ? 'Sắp diễn ra' : 'Đã diễn ra';
  }

  get upcomingCount(): number { return this.activities().filter((item) => this.isUpcoming(item)).length; }

}
