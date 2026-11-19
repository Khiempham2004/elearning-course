import { Component, computed, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import {
  LearningActivity,
  LearningActivityPayload,
  LearningCourse,
  ManagedEnrollment,
  StudentLearningService,
} from '../../../core/services/student-learning.service';

@Component({
  selector: 'app-learning-activities',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './learning-activities.component.html',
  styleUrl: './learning-activities.component.css',
})
export class LearningActivitiesComponent implements OnInit {
  readonly activities = signal<LearningActivity[]>([]);
  readonly courses = signal<LearningCourse[]>([]);
  readonly enrollments = signal<ManagedEnrollment[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly editingId = signal('');
  readonly savingProgressId = signal('');
  readonly progressDraft: Record<string, number> = {};
  readonly lessonsDraft: Record<string, number> = {};
  readonly activeFilter = signal<'all' | LearningActivity['kind']>('all');
  readonly scores: Record<string, number | null> = {};
  readonly feedback: Record<string, string> = {};
  form: LearningActivityPayload = this.emptyForm();
  readonly visibleActivities = computed(() => this.activeFilter() === 'all'
    ? this.activities()
    : this.activities().filter((item) => item.kind === this.activeFilter()));
  readonly publishedCount = computed(() => this.activities().filter((item) => item.status === 'published').length);
  readonly pendingSubmissionCount = computed(() => this.activities().reduce((total, item) => total + (item.submissions?.filter((submission) => submission.score === undefined).length ?? 0), 0));

  constructor(private readonly learning: StudentLearningService, private readonly auth: AuthService) {}

  get noCourseMessage(): string {
    return this.auth.getUserRole() === 'teacher'
      ? 'Chưa có khóa học được phân công. Nhờ admin gắn đúng mã giảng viên hoặc ID tài khoản của bạn vào trường Mã giáo viên trong khóa học.'
      : 'Chưa có khóa học. Hãy tạo khóa học trước khi thêm hoạt động.';
  }

  ngOnInit(): void {
    this.load();
  }

  private emptyForm(): LearningActivityPayload {
    return {
      courseId: '',
      kind: 'schedule',
      title: '',
      description: '',
      startsAt: '',
      dueAt: '',
      location: '',
      meetingUrl: '',
      status: 'published',
    };
  }

  load(): void {
    this.loading.set(true);
    this.learning.getManageActivities().subscribe({
      next: ({ data }) => {
        this.activities.set(data.activities);
        this.courses.set(data.courses);
        this.enrollments.set(data.enrollments ?? []);
        for (const enrollment of data.enrollments ?? []) {
          this.progressDraft[enrollment._id] = enrollment.progress;
          this.lessonsDraft[enrollment._id] = enrollment.completedLessons;
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(
          error?.error?.message ?? 'Không tải được hoạt động học tập.',
        );
        this.loading.set(false);
      },
    });
  }

  edit(activity: LearningActivity): void {
    this.editingId.set(activity._id);
    this.form = {
      courseId: activity.courseId._id,
      kind: activity.kind,
      title: activity.title,
      description: activity.description ?? '',
      startsAt: this.toLocalInput(activity.startsAt),
      dueAt: this.toLocalInput(activity.dueAt),
      durationMinutes: activity.durationMinutes,
      location: activity.location ?? '',
      meetingUrl: activity.meetingUrl ?? '',
      status: activity.status ?? 'published',
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId.set('');
    this.form = this.emptyForm();
  }

  save(): void {
    this.error.set('');
    this.notice.set('');
    if (!this.form.courseId || !this.form.title.trim()) {
      this.error.set('Vui lòng chọn khóa học và nhập tiêu đề.');
      return;
    }
    if ((this.form.kind === 'schedule' || this.form.kind === 'exam') && !this.form.location?.trim() && !this.form.meetingUrl?.trim()) {
      this.error.set(this.form.kind === 'exam' ? 'Bài kiểm tra cần phòng thi hoặc link trực tuyến.' : 'Lịch học cần có phòng học hoặc liên kết lớp để học viên tham gia.');
      return;
    }
    if (this.form.kind === 'exam' && (!this.form.startsAt || (!this.form.durationMinutes && !this.form.dueAt))) {
      this.error.set('Bài kiểm tra cần giờ bắt đầu và thời lượng hoặc hạn kết thúc.');
      return;
    }
    this.saving.set(true);
    const payload: LearningActivityPayload = {
      ...this.form,
      title: this.form.title.trim(),
      startsAt: this.toIso(this.form.startsAt) ?? null,
      dueAt: this.toIso(this.form.dueAt) ?? null,
      durationMinutes: this.form.durationMinutes || null,
    };
    const request = this.editingId()
      ? this.learning.updateActivity(this.editingId(), payload)
      : this.learning.createActivity(payload);
    request.subscribe({
      next: ({ message }) => {
        this.notice.set(message);
        this.saving.set(false);
        this.cancelEdit();
        this.load();
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không lưu được hoạt động.');
        this.saving.set(false);
      },
    });
  }

  remove(activity: LearningActivity): void {
    if (
      !window.confirm(
        `Xóa “${activity.title}”? Hoạt động đã có bài nộp sẽ không thể xóa.`,
      )
    )
      return;
    this.learning.deleteActivity(activity._id).subscribe({
      next: ({ message }) => {
        this.notice.set(message);
        this.load();
      },
      error: (error) =>
        this.error.set(error?.error?.message ?? 'Không xóa được hoạt động.'),
    });
  }

  grade(
    activity: LearningActivity,
    submission: NonNullable<LearningActivity['submissions']>[number],
  ): void {
    const student =
      typeof submission.studentId === 'string'
        ? submission.studentId
        : submission.studentId._id;
    const score = this.scores[`${activity._id}:${student}`];
    if (score === null || score === undefined) {
      this.error.set('Nhập điểm từ 0 đến 100 trước khi lưu.');
      return;
    }
    this.error.set('');
    this.notice.set('');
    this.learning
      .grade(
        activity._id,
        student,
        score,
        this.feedback[`${activity._id}:${student}`] ??
          submission.feedback ??
          '',
      )
      .subscribe({
        next: ({ message }) => {
          this.notice.set(message);
          this.load();
        },
        error: (error) =>
          this.error.set(error?.error?.message ?? 'Không lưu được điểm.'),
      });
  }

  saveProgress(enrollment: ManagedEnrollment): void {
    const progress = Number(this.progressDraft[enrollment._id] ?? enrollment.progress);
    const completedLessons = Number(this.lessonsDraft[enrollment._id] ?? enrollment.completedLessons);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100 || !Number.isInteger(completedLessons) || completedLessons < 0) {
      this.error.set('Tiến độ phải từ 0 đến 100 và số buổi hoàn thành không được âm.');
      return;
    }
    this.error.set('');
    this.notice.set('');
    this.savingProgressId.set(enrollment._id);
    this.learning.updateProgress(enrollment._id, progress, completedLessons).subscribe({
      next: ({ message }) => {
        this.notice.set(message);
        this.savingProgressId.set('');
        this.load();
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không cập nhật được tiến độ học viên.');
        this.savingProgressId.set('');
      },
    });
  }

  enrollmentStudentName(enrollment: ManagedEnrollment): string {
    return typeof enrollment.studentId === 'string' ? enrollment.studentId : enrollment.studentId.userName;
  }

  studentName(
    submission: NonNullable<LearningActivity['submissions']>[number],
  ): string {
    return typeof submission.studentId === 'string'
      ? submission.studentId
      : submission.studentId.userName;
  }

  submissionKey(
    activity: LearningActivity,
    submission: NonNullable<LearningActivity['submissions']>[number],
  ): string {
    const studentId =
      typeof submission.studentId === 'string'
        ? submission.studentId
        : submission.studentId._id;
    return `${activity._id}:${studentId}`;
  }

  activityEnd(activity: LearningActivity): Date | null {
    const deadlines: number[] = [];
    if (activity.dueAt) deadlines.push(new Date(activity.dueAt).getTime());
    if (activity.kind === 'exam' && activity.startsAt && activity.durationMinutes) {
      deadlines.push(new Date(activity.startsAt).getTime() + activity.durationMinutes * 60_000);
    }
    return deadlines.length ? new Date(Math.min(...deadlines)) : null;
  }

  private toLocalInput(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  }

  private toIso(value?: string | null): string | undefined {
    return value ? new Date(value).toISOString() : undefined;
  }
}
