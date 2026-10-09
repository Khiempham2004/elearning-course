import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemLogManagementComponent } from './system-log-management.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {
    path : "",
    component : SystemLogManagementComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SystemLogManagementComponent]
})
export class SystemLogManagementModule { }
