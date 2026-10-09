import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupManagementComponent } from './user-group-management.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UserGroupManagementComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [UserGroupManagementComponent],
})
export class UserGroupManagementModule {}
