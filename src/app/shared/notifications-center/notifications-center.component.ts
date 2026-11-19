import { Component, computed, signal } from '@angular/core';

interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications-center',
  standalone: true,
  templateUrl: './notifications-center.component.html',
  styleUrl: './notifications-center.component.css',
})
export class NotificationsCenterComponent {
  readonly open = signal(false);
  readonly notifications = signal<AppNotification[]>(this.load());
  readonly unreadCount = computed(() => this.notifications().filter((item) => !item.read).length);

  private get storageKey(): string {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      return `notifications-${String(user.id ?? user._id ?? user.userName ?? 'account')}`;
    } catch {
      return 'notifications-account';
    }
  }

  private load(): AppNotification[] {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  toggle(): void { this.open.update((value) => !value); }

  markAsRead(id: string): void {
    this.update(this.notifications().map((item) => item.id === id ? { ...item, read: true } : item));
  }

  markAllAsRead(): void {
    this.update(this.notifications().map((item) => ({ ...item, read: true })));
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  private update(items: AppNotification[]): void {
    this.notifications.set(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
