import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryRoomComponent } from './directoryRoom.component';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzModalComponent, NzModalContentDirective, NzModalService } from 'ng-zorro-antd/modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
const routes: Routes = [
  {
    path: '',
    component: DirectoryRoomComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule.forChild(routes),
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzButtonModule,
    NzModalComponent,
    NzModalContentDirective,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectComponent,
    NzOptionComponent,
    NzIconModule,
    NzPaginationModule,
    FormsModule
],
  providers: [NzModalService],
  declarations: [DirectoryRoomComponent],
})
export class DirectoryRoomModule {}
