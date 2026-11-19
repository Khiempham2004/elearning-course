import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsCenterComponent } from '../../shared/notifications-center/notifications-center.component';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule, RouterOutlet, NotificationsCenterComponent],
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}
  private readonly auth = inject(AuthService);
  singout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
