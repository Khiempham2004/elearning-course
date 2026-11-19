import { Component, computed, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import {
  BarChartOutline,
  BellOutline,
  BookOutline,
  DownOutline,
  HomeOutline,
  LogoutOutline,
  ReadOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { AuthService } from '../../core/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NotificationsCenterComponent } from '../../shared/notifications-center/notifications-center.component';

interface StudentNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Course {
  id: number;
  name: string;
  instructor: string;
  image: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  category: string;
}

interface Schedule {
  id: number;
  title: string;
  subject: string;
  time: string;
  date: string;
  type: 'Online' | 'Offline';
  color: string;
}

@Component({
  selector: 'app-student-layouts',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NzIconModule, NzButtonModule, NotificationsCenterComponent],
  templateUrl: './student-layouts.component.html',
  styleUrl: './student-layouts.component.css',
})
export class StudentLayoutsComponent {
  readonly notifications = signal<StudentNotification[]>([]);
  readonly unreadCount = computed(
    () =>
      this.notifications().filter((notification) => !notification.read).length,
  );
  readonly notificationsOpen = signal(false);
  readonly profileMenuOpen = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly iconService: NzIconService,
  ) {
    this.iconService.addIcon(
      BarChartOutline,
      BellOutline,
      BookOutline,
      DownOutline,
      HomeOutline,
      LogoutOutline,
      ReadOutline,
      UserOutline,
    );
    this.notifications.set(this.loadNotifications());
  }

  get studentName(): string {
    try { return JSON.parse(localStorage.getItem('user') ?? '{}').userName ?? 'Học viên'; }
    catch { return 'Học viên'; }
  }

  private get storageKey(): string {
    let identity = 'student';
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      identity = String(user.userName ?? user.id ?? user._id ?? identity);
    } catch {
      // Keep the generic student key when no saved user record is available.
    }
    return `student-notifications-${identity}`;
  }

  private loadNotifications(): StudentNotification[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? (JSON.parse(saved) as StudentNotification[]) : [];
    } catch {
      return [];
    }
  }

  private saveNotifications(notifications: StudentNotification[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
  }

  private addAccessNotification(): void {
    const notification: StudentNotification = {
      id: `${Date.now()}`,
      message: 'Bạn đã truy cập khu vực quản lý học viên.',
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [notification, ...this.notifications()].slice(0, 20);
    this.notifications.set(updated);
    this.saveNotifications(updated);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((isOpen) => !isOpen);
    this.profileMenuOpen.set(false);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update((isOpen) => !isOpen);
    this.notificationsOpen.set(false);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  markAsRead(notificationId: string): void {
    const updated = this.notifications().map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification,
    );
    this.notifications.set(updated);
    this.saveNotifications(updated);
  }

  markAllAsRead(): void {
    const updated = this.notifications().map((notification) => ({
      ...notification,
      read: true,
    }));
    this.notifications.set(updated);
    this.saveNotifications(updated);
  }

  formatNotificationDate(date: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

   searchTerm = signal('');

  activeMenu = signal('Tổng quan');

  menuItems = [
    { label: 'Tổng quan', icon: '⌂', routerLink: '/student' },
    { label: 'Khóa học của tôi', icon: '▤', routerLink: '/student/courses' },
    { label: 'Lịch học', icon: '▦', routerLink: '/student/schedule' },
    { label: 'Bài tập', icon: '✎', routerLink: '/student/assignments' },
    { label: 'Bài kiểm tra', icon: '▣', routerLink: '/student/exams' },
    { label: 'Kết quả học tập', icon: '▥', routerLink: '/student/progress' },
  ];

  stats = [
    {
      label: 'Khóa học đang học',
      value: 6,
      description: '+2 khóa học mới',
      icon: '▤',
      color: 'blue',
    },
    {
      label: 'Bài tập cần làm',
      value: 4,
      description: 'Cần hoàn thành sớm',
      icon: '✎',
      color: 'orange',
    },
    {
      label: 'Khóa học hoàn thành',
      value: 3,
      description: 'Tiếp tục phát huy!',
      icon: '✓',
      color: 'green',
    },
    {
      label: 'Tổng giờ học',
      value: 48,
      description: 'Trong tháng này',
      icon: '◷',
      color: 'purple',
    },
  ];

  courses = signal<Course[]>([
    {
      id: 1,
      name: 'Lập trình Angular cơ bản',
      instructor: 'Nguyễn Văn An',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
      progress: 75,
      completedLessons: 15,
      totalLessons: 20,
      category: 'Frontend',
    },
    {
      id: 2,
      name: 'JavaScript nâng cao',
      instructor: 'Trần Minh Tuấn',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
      progress: 60,
      completedLessons: 12,
      totalLessons: 20,
      category: 'Programming',
    },
    {
      id: 3,
      name: 'Thiết kế UI/UX',
      instructor: 'Lê Thu Hà',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500',
      progress: 40,
      completedLessons: 8,
      totalLessons: 20,
      category: 'Design',
    },
  ]);

  filteredCourses = computed(() => {
    const keyword = this.searchTerm().trim().toLowerCase();

    if (!keyword) return this.courses();

    return this.courses().filter(course =>
      course.name.toLowerCase().includes(keyword) ||
      course.instructor.toLowerCase().includes(keyword)
    );
  });

  schedules: Schedule[] = [
    {
      id: 1,
      title: 'Angular Component & Signals',
      subject: 'Lập trình Frontend',
      time: '08:00 - 09:30',
      date: '16/11/2026',
      type: 'Online',
      color: 'blue',
    },
    {
      id: 2,
      title: 'JavaScript nâng cao',
      subject: 'Lập trình JavaScript',
      time: '13:30 - 15:00',
      date: '16/11/2026',
      type: 'Offline',
      color: 'orange',
    },
    {
      id: 3,
      title: 'UI Design thực hành',
      subject: 'Thiết kế giao diện',
      time: '09:00 - 10:30',
      date: '17/11/2026',
      type: 'Online',
      color: 'purple',
    },
  ];

  activities = [
    {
      title: 'Hoàn thành bài tập Angular',
      description: 'Lập trình Frontend',
      time: '30 phút trước',
      icon: '✓',
      color: 'green',
    },
    {
      title: 'Đã nộp bài kiểm tra',
      description: 'JavaScript nâng cao',
      time: '2 giờ trước',
      icon: '✎',
      color: 'blue',
    },
    {
      title: 'Đăng ký khóa học mới',
      description: 'Thiết kế UI/UX',
      time: 'Hôm qua',
      icon: '+',
      color: 'purple',
    },
  ];

  selectMenu(label: string): void {
    this.activeMenu.set(label);
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  continueCourse(course: Course): void {
    console.log('Tiếp tục khóa học:', course);
  }

  viewAllCourses(): void {
    console.log('Xem tất cả khóa học');
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
