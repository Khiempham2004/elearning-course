import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { DatePipe, NgFor, NgIf } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentsService } from '../../../core/services/students.service';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzModalModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
    NzDatePickerComponent,
    DatePipe,
    NgIf,
  ],
})
export class StudentsComponent implements OnInit {
  filterSearch: string = '';
  isStudent = false;
  status: 'CREATE' | 'EDIT' | 'DETAIL' = 'CREATE';
  listOfStudent: any[] = [];
  students: any[] = [];
  filterSearchStudent: any[] = [];

  formStudent!: FormGroup;
  studentId: any = null;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.formStudent = this.fb.group({
      studentCode: [null],
      studentName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null],
      gender: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      class: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.getAllStudent();
  }

  handleCreate() {
    this.status = 'CREATE';
    this.isStudent = true;
    this.formStudent.enable();
    this.formStudent.reset();
  }

  handleCancel() {
    this.isStudent = false;
  }

  updatePagition() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfStudent = this.filterSearchStudent.slice(start, end);
  }

  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới học viên';
    }
    if (this.status === 'EDIT') {
      return 'Chỉnh sửa học viên';
    }
    if (this.status === 'DETAIL') {
      return 'Chi tiết học viên';
    }
    return '';
  }

  handleSearch() {
    this.page = 1;
    this.getAllStudent();
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllStudent();
  }

  pageSizeChange(pageSize: any) {
    this.pageSize = pageSize;
    this.page = 1;
    this.getAllStudent();
  }

  getAllStudent() {
    this.studentService
      .getAllStudents(this.filterSearch, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.students = res?.data || [];
          this.listOfStudent = [...this.students];
          this.total = res?.pagination?.totalStudents;
        },
      });
  }

  handleSubmit() {
    if (this.formStudent.invalid) {
      Object.values(this.formStudent.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.formStudent.markAllAsTouched();
        }
      });
      return;
    }

    const payload = this.formStudent.getRawValue();
    if (this.status === 'CREATE') {
      this.studentService.createStudent(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới học viên thành công');
          this.getAllStudent();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo mới học viên thất bại', err);
        },
      });
    } else {
      this.studentService.putStudents(this.studentId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật học viên thành công');
          this.getAllStudent();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật học viên thất bại', err);
        },
      });
    }

    this.isStudent = false;
    this.studentId = null;
    this.getAllStudent();
    this.formStudent.reset();
  }

  handleEdit(item: any) {
    console.log('item edit : ', item);
    this.status = 'EDIT';
    this.studentId = item._id ?? item.id;
    this.formStudent.enable();
    this.formStudent.reset();

    this.isStudent = true;
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (res: any) => {
        const studentData = res?.data;
        this.formStudent.patchValue({
          studentCode: studentData.studentCode ?? '',
          studentName: studentData.studentName ?? '',
          phone: studentData.phone ?? '',
          email: studentData.email ?? '',
          gender: studentData.gender ?? '',
          dob: studentData.dob ?? '',
          class: studentData.class ?? '',
          status: studentData.status ?? '',
        });
      },
    });
    this.getAllStudent();
  }

  handleDelete(item: any) {
    console.log('item delete : ', item);
    this.nzModal.confirm({
      nzTitle: 'Bạn muốn xóa khóa học này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.studentService.deleteStudent(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
            this.getAllStudent();
          },
          error: (err: any) => {
            this.nzMessage.error('Xóa khóa học thất bại', err);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
    this.formStudent.reset();
    this.isStudent = false;
  }

  handleRowClick(item: any) {
    this.status = 'DETAIL';
    this.studentId = item._id ?? item.id;
    this.isStudent = true;

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (res: any) => {
        const studentData = res?.data || res;
        this.formStudent.patchValue(studentData);
        this.formStudent.disable();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.getAllStudent();
  }
}
