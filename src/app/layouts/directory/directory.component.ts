import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
  imports: [RouterModule],
})
export class DirectoryComponent implements OnInit {
  isCollapsed = true;
  isMenuOpen = false;
  constructor(private router: Router) {}
  private readonly auth = inject(AuthService);

  ngOnInit() {}
  signOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
