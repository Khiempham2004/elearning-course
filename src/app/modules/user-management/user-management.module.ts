import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { Router, RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {
    path : "",
    component : UserManagementComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
        
  ],
  declarations: [UserManagementComponent]
})
export class UserManagementModule { }
