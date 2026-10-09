import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {  NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabLinkTemplateDirective } from 'ng-zorro-antd/tabs';
import { NzPaginationComponent, NzPaginationModule } from 'ng-zorro-antd/pagination';
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
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSelectModule,
    NzTabLinkTemplateDirective,
    NzPaginationModule,
    NzSelectComponent,
    FormsModule,
    
],
  declarations: [UserManagementComponent]
})
export class UserManagementModule { }
