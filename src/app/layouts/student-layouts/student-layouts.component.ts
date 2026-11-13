import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { BarChartOutline, BellOutline, BookOutline, DownOutline, HomeOutline, LogoutOutline, ReadOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { AuthService } from '../../core/services/auth.service';

interface StudentNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

@Component({
  selector: 'app-student-layouts',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NzIconModule],
  templateUrl: './student-layouts.component.html',
  styleUrl: './student-layouts.component.css'
})
export class StudentLayoutsComponent {
  readonly notifications = signal<StudentNotification[]>([]);
  readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.read).length,
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
    this.addAccessNotification();
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
      notification.id === notificationId ? { ...notification, read: true } : notification,
    );
    this.notifications.set(updated);
    this.saveNotifications(updated);
  }

  markAllAsRead(): void {
    const updated = this.notifications().map((notification) => ({ ...notification, read: true }));
    this.notifications.set(updated);
    this.saveNotifications(updated);
  }

  formatNotificationDate(date: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

}
