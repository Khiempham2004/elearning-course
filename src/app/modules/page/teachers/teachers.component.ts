import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NzModalModule,
  NzModalComponent,
  NzModalContentDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeachersService } from '../../../core/services/teachers.service';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [
    NzButtonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzModalComponent,
    NzModalContentDirective,
    DatePipe,
    NzOptionComponent,
    NgFor,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzTagModule,
    FormsModule,
    NgIf,
  ],
})
export class TeachersComponent implements OnInit {
  isTeacher = false;
  status: 'CREATE' | 'EDIT' | 'DETAIL' = 'CREATE';
  formTeacher!: FormGroup;
  teachers: any = [];
  listOfTeacher: any = [];
  filterSearch: string = '';
  fitlerTeacherSearch: any;
  teacherId: any = null;

  page = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeachersService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.formTeacher = this.fb.group({
      teacherCode: [null],
      fullName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dateOfBirth: [null],
      hometown: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null],
      department: [null],
      specialization: [null],
      degree: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.getAllTeacher();
  }

  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới giảng viên';
    }
    if (this.status === 'EDIT') {
      return 'Chỉnh sửa giảng viên';
    }
    if (this.status === 'DETAIL') {
      return 'Chi tiết giảng viên';
    }
    return '';
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllTeacher();
  }

  pageSizeChange(pageSize: any) {
    this.pageSize = pageSize;
    this.page = 1;
    this.getAllTeacher();
  }
  handleCreate() {
    this.isTeacher = true;
    this.status = 'CREATE';
    this.formTeacher.enable();
    this.formTeacher.reset();
  }

  updatePagition() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.listOfTeacher = this.fitlerTeacherSearch.slice(start, end);
  }

  handleSearch() {
    const keyword = this.filterSearch.trim().toLowerCase();
    this.page = 1;

    if (!keyword) {
      this.fitlerTeacherSearch = [...this.teachers];
    } else {
      this.fitlerTeacherSearch = this.teachers.filter((item: any) => {
        return item.fullName.toLowerCase().includes(keyword);
      });
    }
    this.total = this.fitlerTeacherSearch.length;
    this.updatePagition();
  }

  getAllTeacher() {
    this.teacherService
      .getAllTeachers(this.filterSearch, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.teachers = res?.data || [];
          this.listOfTeacher = [...this.teachers];
          this.total = res?.pagination?.totalTeachers;
        },
      });
  }
  handleSubmit() {
    if (this.formTeacher.invalid) {
      Object.values(this.formTeacher.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.formTeacher.markAllAsTouched();
        }
      });
      return;
    }

    const payload = this.formTeacher.getRawValue();

    if (this.status === 'CREATE') {
      this.teacherService.createTeacher(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới giảng viên thành công');
          this.getAllTeacher();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo  mới giảng viên thất bại', err);
        },
      });
    } else {
      this.teacherService.putTeacher(this.teacherId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật giảng viên thành công');
          this.getAllTeacher();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật giảng viên thất bại', err);
        },
      });
    }

    this.teacherId = null;
    this.isTeacher = false;
    this.getAllTeacher();
    this.formTeacher.reset();
  }

  handleCancel() {
    this.isTeacher = false;
    this.formTeacher.reset();
  }

  handleEdit(item: any) {
    this.status = 'EDIT';
    this.teacherId = item._id ?? item.id;
    this.isTeacher = true;
    this.teacherService.getTeacherById(this.teacherId).subscribe({
      next: (res: any) => {
        const teacherData = res?.data || res;
        this.formTeacher.patchValue(teacherData);
        this.formTeacher.enable();
      },
      error: (err: any) => {
        this.nzMessage.error('Lấy chi tiết giảng viên thất bại', err);
        console.log(err);
      },
    });
    this.getAllTeacher();
  }

  handleDelete(item: any) {
    this.nzModal.confirm({
      nzTitle: 'Bạn muốn xóa khóa học này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.teacherService.deleteTeacher(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
            this.formTeacher.reset();
            this.getAllTeacher();
          },
          error: (err: any) => {
            this.nzMessage.error('Xóa khóa học thất bại', err);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  handleRowClick(item: any) {
    this.status = 'DETAIL';
    this.teacherId = item._id ?? item.id;
    this.isTeacher = true;

    this.teacherService.getTeacherById(this.teacherId).subscribe({
      next: (res: any) => {
        const teacherData = res?.data || res;
        this.formTeacher.patchValue(teacherData);
        this.formTeacher.disable();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.getAllTeacher();
  }
}
