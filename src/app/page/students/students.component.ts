import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { DatePipe, NgFor } from '@angular/common';

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
import { StudentsService } from '../../component/services/students.service';
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
  ],
})
export class StudentsComponent implements OnInit {
  filterSearch: string = '';
  isStudent = false;
  status: 'CREATE' | 'EDIT' = 'CREATE';
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
    return '';
  }

  handleSearch() {
    const keyword = this.filterSearch.trim().toLowerCase();
    console.log('keyword search : ', keyword);

    this.page = 1;

    if (!keyword) {
      this.filterSearchStudent = [...this.students];
    } else {
      this.filterSearchStudent = this.students.filter((item: any) => {
        return item.studentName.toLowerCase().includes(keyword);
      });
    }
    this.total = this.filterSearchStudent.length;
    this.updatePagition();
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
    this.studentService.getAllStudents().subscribe({
      next: (res: any) => {
        this.students = res || [];
        this.listOfStudent = [
          ...this.students.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.students.length;
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
    this.studentId = item.id;
    this.studentService.getStudentById(item.id).subscribe({
      next: (res: any) => {
        this.formStudent.patchValue({
          studentCode: res?.studentCode ?? '',
          studentName: res?.studentName ?? '',
          phone: res?.phone ?? '',
          email: res?.email ?? '',
          gender: res?.gender ?? '',
          dob: res?.dob ?? '',
          class: res?.class ?? '',
          status: res?.status ?? '',
        });
        this.getAllStudent();
        this.isStudent = true;
      },
    });
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
        this.studentService.deleteStudent(item.id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
            this.formStudent.reset();
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
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.studentId = item.id;
    this.isStudent = true;

    this.studentService.getStudentById(item.id).subscribe({
      next: (res: any) => {
        this.formStudent.patchValue(res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.getAllStudent();
  }
}
