import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsCenterComponent } from '../../shared/notifications-center/notifications-center.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NotificationsCenterComponent],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.css',
})
export class TeacherLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
