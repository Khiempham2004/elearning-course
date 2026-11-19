import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LearningActivity,
  StudentLearningService,
} from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-exams-elearning',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './exams-elearning.component.html',
  styleUrl: './exams-elearning.component.css',
})
export class ExamsElearningComponent implements OnInit {
  readonly items = signal<LearningActivity[]>([]);
  readonly answers: Record<string, string> = {};
  readonly loading = signal(true);
  readonly submitting = signal('');
  readonly message = signal('');
  readonly error = signal('');
  readonly hasCourses = signal(false);
  get submittedCount(): number {
    return this.items().filter((item) => !!item.submission).length;
  }
  get openCount(): number {
    return this.items().filter((item) => this.canSubmit(item)).length;
  }
  constructor(private readonly learningService: StudentLearningService) {}
  ngOnInit(): void {
    this.learningService.getMyLearning().subscribe({
      next: ({ data }) => {
        this.hasCourses.set(data.enrollments.length > 0);
        this.items.set(
          data.activities
            .filter((item) => item.kind === 'exam')
            .sort((a, b) =>
              (a.startsAt ?? a.dueAt ?? '').localeCompare(
                b.startsAt ?? b.dueAt ?? '',
              ),
            ),
        );
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không tải được bài kiểm tra.');
        this.loading.set(false);
      },
    });
  }
  setAnswer(id: string, event: Event): void {
    this.answers[id] = (event.target as HTMLTextAreaElement).value;
  }
  opensAt(item: LearningActivity): number | null {
    return item.startsAt ? new Date(item.startsAt).getTime() : null;
  }
  closesAt(item: LearningActivity): number | null {
    const deadlines: number[] = [];
    if (item.dueAt) deadlines.push(new Date(item.dueAt).getTime());
    const startsAt = this.opensAt(item);
    if (startsAt !== null && item.durationMinutes) deadlines.push(startsAt + item.durationMinutes * 60_000);
    return deadlines.length ? Math.min(...deadlines) : null;
  }
  canSubmit(item: LearningActivity): boolean {
    const start = this.opensAt(item);
    const end = this.closesAt(item);
    return (
      (start === null || Date.now() >= start) &&
      (end === null || Date.now() <= end)
    );
  }
  isBeforeOpen(item: LearningActivity): boolean {
    const start = this.opensAt(item);
    return start !== null && Date.now() < start;
  }
  submit(item: LearningActivity): void {
    if (!this.canSubmit(item)) {
      this.error.set('Bài kiểm tra hiện chưa mở hoặc đã hết thời gian.');
      return;
    }
    this.message.set('');
    this.error.set('');
    this.submitting.set(item._id);
    this.learningService
      .submit(item._id, this.answers[item._id] || item.submission?.answer || '')
      .subscribe({
        next: ({ message }) => {
          this.message.set(message);
          this.submitting.set('');
          this.ngOnInit();
        },
        error: (error) => {
          this.error.set(error?.error?.message ?? 'Gửi bài kiểm tra thất bại.');
          this.submitting.set('');
        },
      });
  }
}
