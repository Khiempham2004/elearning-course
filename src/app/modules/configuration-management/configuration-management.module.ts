import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { RouterModule, Routes } from '@angular/router';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalComponent, NzModalContentDirective, NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DataTableComponent } from '../../shared/data-table/data-table.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationManagementComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzTableComponent,
    NzFormModule,
    NzModalModule,
    NzModalComponent,
    NzModalContentDirective,
    FormsModule,
    NzSelectComponent,
    NzOptionComponent,
    ReactiveFormsModule,
    NzPaginationModule,
    DataTableComponent
],
  declarations: [ConfigurationManagementComponent],
})
export class ConfigurationManagementModule {}
