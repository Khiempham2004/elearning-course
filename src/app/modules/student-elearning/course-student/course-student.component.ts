import { Component, computed, signal } from '@angular/core';

interface StudentCourse {
  id: number;
  title: string;
  category: string;
  instructor: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  color: string;
  icon: string;
  status: 'Đang học' | 'Chưa bắt đầu';
}

@Component({
  selector: 'app-course-student',
  standalone: true,
  imports: [],
  templateUrl: './course-student.component.html',
  styleUrl: './course-student.component.css',
})
export class CourseStudentComponent {
  readonly searchText = signal('');
  readonly activeCategory = signal('Tất cả');

  readonly categories = ['Tất cả', 'Lập trình', 'Thiết kế', 'Cơ sở dữ liệu'];

  // Dữ liệu mẫu để hoàn thiện giao diện trước khi nối API khóa học.
  readonly courses = signal<StudentCourse[]>([
    {
      id: 1,
      title: 'Lập trình Angular từ cơ bản',
      category: 'Lập trình',
      instructor: 'Nguyễn Minh Anh',
      description: 'Xây dựng ứng dụng web hiện đại với Angular và TypeScript.',
      lessons: 24,
      duration: '8 giờ 30 phút',
      progress: 68,
      color: 'violet',
      icon: 'A',
      status: 'Đang học',
    },
    {
      id: 2,
      title: 'UI/UX Design thực chiến',
      category: 'Thiết kế',
      instructor: 'Trần Thu Hà',
      description: 'Từ nghiên cứu người dùng đến thiết kế giao diện hoàn chỉnh.',
      lessons: 18,
      duration: '6 giờ 15 phút',
      progress: 32,
      color: 'orange',
      icon: '✦',
      status: 'Đang học',
    },
    {
      id: 3,
      title: 'SQL và thiết kế cơ sở dữ liệu',
      category: 'Cơ sở dữ liệu',
      instructor: 'Lê Hoàng Nam',
      description: 'Nắm vững truy vấn SQL và cách tổ chức dữ liệu hiệu quả.',
      lessons: 16,
      duration: '5 giờ 40 phút',
      progress: 0,
      color: 'blue',
      icon: 'DB',
      status: 'Chưa bắt đầu',
    },
  ]);

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

  readonly inProgressCount = computed(
    () => this.courses().filter((course) => course.progress > 0 && course.progress < 100).length,
  );

  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }
}
