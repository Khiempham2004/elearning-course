import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationManagementComponent } from './notification-management.component';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzModalComponent, NzModalContentDirective, NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';

const routes : Routes = [
  {
    path : "",
    component : NotificationManagementComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzButtonModule,
    NzIconModule,
    NzInputDirective,
    NzTableComponent,
    NzModalComponent,
    NzModalContentDirective,
    FormsModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzModalModule,
    NzSelectComponent,
    NzOptionComponent,
    NzDatePickerComponent,
    NzAutosizeDirective,
    NzPaginationComponent
],
  declarations: [NotificationManagementComponent]
})
export class NotificationManagementModule { }
