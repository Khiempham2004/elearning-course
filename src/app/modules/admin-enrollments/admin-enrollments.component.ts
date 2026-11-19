import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminEnrollmentsService } from './admin-enrollments.service';
import { CorusesService } from '../../core/services/coruses.service';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSelectComponent } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [FormsModule, DatePipe, NzPaginationComponent, NzSelectComponent],
  templateUrl: './admin-enrollments.component.html',
  styleUrl: './admin-enrollments.component.css',
})
export class AdminEnrollmentsComponent implements OnInit {
  readonly items = signal<any[]>([]);
  readonly courses = signal<any[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly error = signal('');
  keyword = '';
  courseId = '';
  status = '';
  readonly progressDraft: Record<string, number> = {};
  readonly lessonsDraft: Record<string, number> = {};
  constructor(
    private readonly service: AdminEnrollmentsService,
    private readonly courseService: CorusesService,
  ) {}
  ngOnInit(): void {
    this.load();
    this.courseService
      .getAllCourses('', 1, 100)
      .subscribe((response: any) => this.courses.set(response?.data ?? []));
  }
  load(): void {
    this.loading.set(true);
    this.service
      .list(
        this.page(),
        this.pageSize(),
        this.keyword,
        this.courseId,
        this.status,
      )
      .subscribe({
        next: (response) => {
          const items = response.data ?? [];
          this.items.set(items);
          for (const item of items) {
            this.progressDraft[item._id] = item.progress;
            this.lessonsDraft[item._id] = item.completedLessons;
          }
          this.total.set(response.pagination?.total ?? 0);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(
            error?.error?.message ?? 'Không tải được danh sách đăng ký.',
          );
          this.loading.set(false);
        },
      });
  }
  search(): void {
    this.page.set(1);
    this.load();
  }
  changePage(page: number): void {
    this.page.set(page);
    this.load();
  }
  changePageSize(pagesize:number):void{
    this.pageSize.set(pagesize);
    this.page.set(1);
    this.load();
  }
  updateStatus(item: any, status: string): void {
    this.service.update(item._id, { status }).subscribe({
      next: () => this.load(),
      error: (error) =>
        this.error.set(
          error?.error?.message ?? 'Không đổi được trạng thái đăng ký.',
        ),
    });
  }
  updateProgress(item: any): void {
    const progress = Number(this.progressDraft[item._id] ?? item.progress);
    const completedLessons = Number(
      this.lessonsDraft[item._id] ?? item.completedLessons,
    );
    this.service.update(item._id, { progress, completedLessons }).subscribe({
      next: () => this.load(),
      error: (error) =>
        this.error.set(error?.error?.message ?? 'Không lưu được tiến độ.'),
    });
  }
  studentName(item: any): string {
    return item.studentId?.userName ?? 'Tài khoản đã xóa';
  }
  courseName(item: any): string {
    return item.courseId
      ? `${item.courseId.courseCode} · ${item.courseId.courseName}`
      : 'Khóa học đã xóa';
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  }
   optionAdminEnrollment = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];

}
