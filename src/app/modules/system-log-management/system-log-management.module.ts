import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemLogManagementComponent } from './system-log-management.component';
import { RouterModule, Routes } from '@angular/router';
import { NzInputDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzOptionComponent, NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzIconModule
],
  declarations: [SystemLogManagementComponent]
})
export class SystemLogManagementModule { }
