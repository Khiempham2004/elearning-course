import { Component, computed, OnInit, signal } from '@angular/core';
import { StudentLearningService } from '../../../core/services/student-learning.service';
import { RouterLink } from '@angular/router';

interface StudentCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  color: string;
  icon: string;
  status: 'Đang học' | 'Chưa bắt đầu' | 'Hoàn thành';
  enrollmentStatus: 'active' | 'completed' | null;
}

@Component({
  selector: 'app-course-student',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-student.component.html',
  styleUrl: './course-student.component.css',
})
export class CourseStudentComponent implements OnInit {
  readonly searchText = signal('');
  readonly activeCategory = signal('Tất cả');

  readonly categories = computed(() => ['Tất cả', ...new Set(this.courses().map((course) => course.category))]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly enrolling = signal('');

  constructor(private readonly learningService: StudentLearningService) {}

  ngOnInit(): void {
    this.learningService.getCatalog().subscribe({
      next: ({ data }) => {
        this.courses.set(data.map((course) => ({
          id: course._id,
          title: course.courseName,
          category: course.category || 'Khác',
          instructor: course.teacherName || 'Chưa cập nhật',
          description: `${course.courseCode}${course.duration ? ` · ${course.duration} giờ` : ''}`,
          lessons: 0,
          duration: course.duration ? `${course.duration} giờ` : 'Theo chương trình',
          progress: course.progress ?? 0,
          enrollmentStatus: course.enrollmentStatus ?? null,
          color: 'blue',
          icon: 'E',
          status: course.enrollmentStatus === 'completed' ? 'Hoàn thành' : course.enrollmentStatus ? 'Đang học' : 'Chưa bắt đầu',
        })));
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Không tải được danh sách khóa học.');
        this.loading.set(false);
      },
    });
  }

  enroll(course: StudentCourse): void {
    const courseId = course.id;
    this.enrolling.set(courseId);
    this.learningService.enroll(courseId).subscribe({
      next: () => { this.enrolling.set(''); this.ngOnInit(); },
      error: (error) => { this.error.set(error?.error?.message ?? 'Đăng ký khóa học thất bại.'); this.enrolling.set(''); },
    });
  }

  // Danh mục khóa học do trung tâm công bố.
  readonly courses = signal<StudentCourse[]>([]);

  readonly filteredCourses = computed(() => {
    const keyword = this.searchText().trim().toLocaleLowerCase('vi');
    const category = this.activeCategory();
    return this.courses().filter((course) => {
      const matchesCategory = category === 'Tất cả' || course.category === category;
      const matchesSearch = !keyword ||
        `${course.title} ${course.instructor} ${course.category}`.toLocaleLowerCase('vi').includes(keyword);
      return matchesCategory && matchesSearch;
    });
  });

  readonly inProgressCount = computed(() => this.courses().filter((course) => course.progress > 0).length);
  readonly registeredCount = computed(() => this.courses().filter((course) => !!course.enrollmentStatus).length);
  readonly completedCount = computed(() => this.courses().filter((course) => course.enrollmentStatus === 'completed').length);

  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }
}
