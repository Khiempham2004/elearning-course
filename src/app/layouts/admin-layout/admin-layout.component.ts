import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconDirective, NzIconService } from 'ng-zorro-antd/icon';
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
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule, RouterOutlet, NzButtonModule, NzIconDirective],
})
export class AdminLayoutComponent implements OnInit {
  readonly notifications = signal<StudentNotification[]>([]);
  readonly notificationsOpen = signal(false);
  readonly profileMenuOpen = signal(false);
  readonly unreadCount = computed(
    () =>
      this.notifications().filter((notification) => !notification.read).length,
  );
  constructor(
    private router: Router,
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
    this.addAccessNotification();
  }
  private readonly auth = inject(AuthService);
  ngOnInit() {
    this.notifications.set(this.loadNotifications());
  }
  addAccessNotification() {
    const notification: StudentNotification = {
      id: `${Date.now()}`,
      message: 'Bạn đã truy cập khu vực quản lý admin',
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

  markAllAsRead(): void {
    const updated = this.notifications().map((notification) => ({
      ...notification,
      read: true,
    }));
    this.notifications.set(updated);
    this.saveNotifications(updated);
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

  formatNotificationDate(date: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  singout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
