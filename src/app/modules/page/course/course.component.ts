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
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CorusesService } from '../../../core/services/coruses.service';
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
    DatePipe,
    FormsModule,
    NzIconModule,
    NgIf,
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
  status: 'CREATE' | 'EDIT' | 'DETAIL' = 'CREATE';

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
    this.form.enable();
    this.form.reset();
  }
  cancelModalCourse() {
    this.isCourse = false;
    this.form.reset();
  }

  get modalTitleCourse(): string {
    if (this.status === 'CREATE') {
      return 'Thêm mới Khóa học';
    }
    if (this.status === 'EDIT') {
      return 'Chỉnh sửa Khóa học';
    }
    if (this.status === 'DETAIL') {
      return 'Chi tiết Khóa học';
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
    this.page = 1;
    this.getAllCourses();
  }

  getAllCourses() {
    this.courseService
      .getAllCourses(this.filterSearch, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.courses = res?.data || [];
          this.listOfCourse = [...this.courses];
          console.log('list of course', this.listOfCourse);

          //phan trang lay data
          this.total = res?.pagination?.totalCourses || 0;
        },
        error: (err) => {
          this.nzMessage.error('Không thể tải danh sách khóa học');
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
            this.form.enable();
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
    this.form.enable();
    this.form.reset();
  }

  handleEdit(item: any) {
    console.log('item edit :', item);
    this.status = 'EDIT';
    this.courseId = item._id ?? item.id;
    this.isCourse = true;

    this.form.enable();
    this.form.reset();

    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        const courseData = res.data;
        if (!courseData) {
          console.log('Khong co du lieu khoa hoc');
          return;
        }
        console.log('course data :', courseData);

        if (courseData) {
          this.form.patchValue({
            courseCode: courseData.courseCode,
            courseName: courseData.courseName,
            category: courseData.category,
            teacherId: courseData.teacherId,
            teacherName: courseData.teacherName,
            duration: courseData.duration,
            maxStudents: courseData.maxStudents,
            price: courseData.price,
            startDate: courseData.startDate,
            endDate: courseData.endDate,
            status: courseData.status,
          });
        }
      },
      error: (err: any) => {
        console.log('Lỗi khi lấy thông tin khóa học', err);
      },
    });
    this.getAllCourses();
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
        this.courseService.deleteCourse(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
            this.getAllCourses();
          },
          error: (err: any) => {
            this.nzMessage.error('Xóa khóa học thất bại', err);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
    this.form.reset();
    this.isCourse = false;
  }

  handleRowClick(item: any) {
    this.status = 'DETAIL';
    this.courseId = item._id ?? item.id;
    this.isCourse = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        const courseData = res?.data || res;
        this.form.patchValue(courseData);
        this.form.disable();
      },
      error: (err: any) => {
        console.log('Lấy chi tiết khóa học thất bại', err);
      },
    });
    this.getAllCourses();
  }
}
