import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsCenterComponent } from '../../shared/notifications-center/notifications-center.component';

@Component({
  selector: 'app-course-layout',
  standalone: true,
  imports: [RouterOutlet, NotificationsCenterComponent],
  templateUrl: './course-layout.component.html',
  styleUrl: './course-layout.component.css',
})
export class CourseLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
