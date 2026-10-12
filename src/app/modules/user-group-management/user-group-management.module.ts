import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupManagementComponent } from './user-group-management.component';
import { RouterModule, Routes } from '@angular/router';
import { NzInputDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

const routes: Routes = [
  {
    path: '',
    component: UserGroupManagementComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzInputDirective,
    NzButtonComponent,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormDirective,
    NzFormItemComponent,
    NzColDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzAutosizeDirective,
    NzIconModule
],
  declarations: [UserGroupManagementComponent],
})
export class UserGroupManagementModule {}
