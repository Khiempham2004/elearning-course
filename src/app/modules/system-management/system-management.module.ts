import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemManagementComponent } from './system-management.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {
    path : '',
    component : SystemManagementComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SystemManagementComponent]
})
export class SystemManagementModule { }
