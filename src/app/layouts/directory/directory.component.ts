import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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

  ngOnInit() {}

  signOut() {
    this.router.navigate(['/login']);
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
