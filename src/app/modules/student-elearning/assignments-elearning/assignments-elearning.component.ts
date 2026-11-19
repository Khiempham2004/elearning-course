import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LearningActivity,
  StudentLearningService,
} from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-assignments-elearning',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './assignments-elearning.component.html',
  styleUrl: './assignments-elearning.component.css',
})
export class AssignmentsElearningComponent implements OnInit {
  readonly items = signal<LearningActivity[]>([]);
  readonly answers: Record<string, string> = {};
  readonly loading = signal(true);
  readonly submitting = signal('');
  readonly message = signal('');
  readonly error = signal('');
  readonly hasCourses = signal(false);
  get pendingCount(): number {
    return this.items().filter((item) => !item.submission).length;
  }
  get gradedCount(): number {
    return this.items().filter((item) => item.submission?.score !== undefined)
      .length;
  }
  constructor(private readonly learningService: StudentLearningService) {
    
  }
  ngOnInit(): void {
    this.learningService.getMyLearning().subscribe({
      next: ({ data }) => {
        this.hasCourses.set(data.enrollments.length > 0);
        this.items.set(
          data.activities
            .filter((item) => item.kind === 'assignment')
            .sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? '')),
        );
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không tải được bài tập.');
        this.loading.set(false);
      },
    });
  }
  setAnswer(id: string, event: Event): void {
    this.answers[id] = (event.target as HTMLTextAreaElement).value;
  }
  isClosed(item: LearningActivity): boolean {
    return !!item.dueAt && new Date(item.dueAt).getTime() < Date.now();
  }
  submit(item: LearningActivity): void {
    if (this.isClosed(item)) {
      this.error.set('Bài tập đã quá hạn nộp.');
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
          this.error.set(error?.error?.message ?? 'Nộp bài thất bại.');
          this.submitting.set('');
        },
      });
  }
}
