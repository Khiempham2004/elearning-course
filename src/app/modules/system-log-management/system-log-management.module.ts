import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemLogManagementComponent } from './system-log-management.component';
import { RouterModule, Routes } from '@angular/router';
import { NzInputDirective, NzAutosizeDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzOptionComponent, NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { TeachersComponent } from '../page/teachers/teachers.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';

const routes : Routes = [
  {
    path : "",
    component : SystemLogManagementComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzDatePickerComponent,
    NzAutosizeDirective,
    NzOptionComponent,
    NzSelectComponent,
    NzSelectModule,
    NzModalComponent,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzPaginationComponent,
    NzFormModule,
    FormsModule,
    TeachersComponent,
    DataTableComponent
],
  declarations: [SystemLogManagementComponent]
})
export class SystemLogManagementModule { }
