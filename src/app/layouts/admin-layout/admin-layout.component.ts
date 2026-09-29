import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule, RouterOutlet],
})
export class AdminLayoutComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  singout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
