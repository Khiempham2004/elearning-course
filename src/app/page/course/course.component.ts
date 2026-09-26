import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe, NgFor } from '@angular/common';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CorusesService } from '../../component/services/coruses.service';
import { finalize } from 'rxjs';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: true,
  imports: [
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule,
    NzModalContentDirective,
    ReactiveFormsModule,
    NzLayoutModule,
    NzFormModule,
    NzSelectModule,
    NgFor,
    NzInputNumberModule,
    NzDatePickerModule,
    NzPaginationComponent,
    DatePipe,
    FormsModule,
    NzIconModule
  ],
})
export class CourseComponent implements OnInit {
  form: FormGroup;
  courses: any[] = [];
  listOfCourse: any[] = [];
  searchKeyword: any = [];
  filterSearch: string = '';
  filterCourseSearch: any[] = [];
  courseId: any;
  isCourse = false;
  startDate: Date | null = null;
  status: 'CREATE' | 'EDIT' = 'CREATE';

  page = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private courseService: CorusesService,
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
  ) {
    this.form = this.fb.group({
      courseCode: [''],
      courseName: ['', Validators.required],
      category: [''],
      teacherId: [null],
      teacherName: [null, Validators.required],
      duration: [null, Validators.required],
      maxStudents: [null, Validators.required],
      price: [null],
      startDate: [null],
      endDate: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.getAllCourses();
  }
  onStartDateChange(date: Date): void {
    this.startDate = date;
  }

  openModalCourse() {
    this.status = 'CREATE';
    this.isCourse = true;
  }
  cancelModalCourse() {
    this.isCourse = false;
    this.form.reset();
  }

  get modalTitleCourse(): string {
    if (this.status === 'CREATE') {
      return 'Tạo mới khóa học';
    }
    if (this.status === 'EDIT') {
      return 'Chỉnh sửa khóa học';
    }
    return '';
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllCourses();
  }

  pageSizeChange(pageSize: any) {
    this.pageSize = pageSize;
    this.page = 1;
    this.getAllCourses();
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfCourse = this.filterCourseSearch.slice(start, end);
  }

  handleFiterSearch(): void {
    const keyword = this.filterSearch.trim().toLowerCase();

    this.page = 1;

    if (!keyword) {
      this.filterCourseSearch = [...this.courses];
    } else {
      //cos keyword moi filter
      this.filterCourseSearch = this.courses.filter((course: any) => {
        return (
          course.teacherName?.toLowerCase().includes(keyword) ||
          course.teacherName?.toLowerCase().includes(keyword)
        );
      });
    }
    //tong sau khi search
    this.total = this.filterCourseSearch.length;

    this.updatePagination();
  }

  getAllCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res;
        this.listOfCourse = [
          ...this.courses.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.courses.length;
      },
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.nzMessage.warning('Vui lòng chọn đầy đủ bản ghi');
    }
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          (control.markAsDirty(),
            control.updateValueAndValidity({ onlySelf: true }),
            this.form.markAllAsTouched());
        }
      });
      return;
    }

    const payload = this.form.getRawValue();

    if (this.status === 'CREATE') {
      this.courseService
        .createCourse(payload)
        .pipe(
          finalize(() => {
            this.isCourse = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            this.nzMessage.success('Tạo mới thành công', res);
            this.getAllCourses();
          },
          error: (err: any) => {
            console.log('Create you error : ', err);
            this.nzMessage.error('Tạo mới thất bại');
          },
        });
    } else {
      this.courseService.putCourse(this.courseId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật thành công');
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật thất bại');
          console.log('Update your errror : ', err);
        },
      });
      this.getAllCourses();
      this.form.reset();
    }

    this.courseId = null;
    this.isCourse = false;
    this.getAllCourses();
    this.form.reset();
  }

  handlleEdit(item: any) {
    console.log('item edit :', item);
    this.status = 'EDIT';
    this.courseId = item.id;
    this.courseService.getCourseById(item.id).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          courseCode: res?.courseCode,
          courseName: res?.courseName,
          category: res?.category,
          teacherId: res?.teacherId,
          teacherName: res?.teacherName,
          duration: res?.duration,
          maxStudents: res?.maxStudents,
          price: res?.price,
          startDate: res?.startDate,
          endDate: res?.endDate,
          status: res?.status,
        });
        this.getAllCourses();
        this.isCourse = true;
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
        this.courseService.deleteCourse(item.id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
          },
          error: (err: any) => {
            this.nzMessage.error('Xóa khóa học thất bại', err);
          },
        });
        this.form.reset();
        this.getAllCourses();
        this.isCourse = false;
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.courseId = item.id;
    this.isCourse = true;
    this.courseService.getCourseById(item.id).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
      },
      error: (err: any) => {
        console.log('Lấy chi tiết khóa học thất bại', err);
      },
    });
  }
}
