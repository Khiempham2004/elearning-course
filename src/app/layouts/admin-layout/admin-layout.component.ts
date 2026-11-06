import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule, RouterOutlet],
})
export class AdminLayoutComponent implements OnInit {
  constructor(private router: Router) {}
  private readonly auth = inject(AuthService);
  ngOnInit() {}

  singout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
