import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemManagementComponent } from './system-management.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabLinkTemplateDirective } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

const routes: Routes = [
  {
    path: '',
    component: SystemManagementComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzFormModule,
    NzTableModule,
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSelectModule,
    NzTabLinkTemplateDirective,
    NzPaginationModule,
    NzSelectComponent,
    FormsModule,
    NzModalModule
  ],
  declarations: [SystemManagementComponent],
})
export class SystemManagementModule {}
