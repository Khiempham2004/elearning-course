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
import {
  NzPaginationComponent,
  NzPaginationModule,
} from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  DataTableColumn,
  DataTableComponent,
} from '../../../shared/data-table/data-table.component';
import { AuthService } from '../../../core/services/auth.service';
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
    NzInputNumberModule,
    NzDatePickerModule,
    FormsModule,
    NzIconModule,
    NgIf,
    NzPaginationModule,
    DataTableComponent,
  ],
})
export class CourseComponent implements OnInit {
  tableColumn: DataTableColumn<any>[] = [];
  form: FormGroup;
  courses: any[] = [];
  categoryNames: string[] = [];
  listOfCourse: any[] = [];
  searchKeyword: any = [];
  filterSearch: string = '';
  filterCourseSearch: any[] = [];
  courseId: any;
  isCourse = false;
  startDate: Date | null = null;
  status: 'CREATE' | 'EDIT' | 'DETAIL' = 'CREATE';

  page = 1;
  pageSize = 5;
  total = 0;
  get isAdmin(): boolean { return this.authService.getUserRole() === 'admin'; }

  constructor(
    private fb: FormBuilder,
    private courseService: CorusesService,
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
    private readonly authService: AuthService,
  ) {
    this.form = this.fb.group({
      courseCode: [''],
      courseName: ['', Validators.required],
      category: [''],
      teacherId: [null, Validators.required],
      teacherName: [null, Validators.required],
      duration: [null, Validators.required],
      maxStudents: [null, Validators.required],
      price: [null],
      startDate: [null],
      endDate: [null],
      status: [null],
      approvalStatus: ['approved'],
    });
  }

  ngOnInit() {
    this.initialDatatable();
    this.getAllCourses();
    this.courseService.getCategories().subscribe({ next: (res: any) => this.categoryNames = (res?.data ?? []).map((item: any) => item.name) });
  }

  initialDatatable() {
    this.tableColumn = [
      {
        title: 'Mã khóa học',
        key: 'courseCode',
        width: '120px',
      },
      {
        title: 'Tên khóa học',
        key: 'courseName',
        width: '120px',
      },
      {
        title: 'Loại khóa học',
        key: 'category',
        width: '100px',
      },
      {
        title: 'Mã giáo viên',
        key: 'teacherId',
        width: '120px',
      },
      {
        title: 'Tên giáo viên',
        key: 'teacherName',
        width: '150px',
      },
      {
        title: 'Khoảng thời gian',
        key: 'duration',
        width: '100px',
      },
      {
        title: 'Số học viên tối đa',
        key: 'maxStudents',
        width: '120px',
      },
      {
        title: 'Giá',
        key: 'price',
        width: '100px',
      },
      {
        title: 'Ngày bắt đầu',
        key: 'startDate',
        width: '120px',
        dateFormat: 'dd/MM/yyyy',
      },
      {
        title: 'Ngày kết thúc',
        key: 'endDate',
        width: '120px',
        dateFormat: 'dd/MM/yyyy',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: '100px',
      },
      { title: 'Duyệt khóa học', key: 'approvalStatus', width: '110px' },
      {
        title: 'Hành động',
        key: 'action',
        width: '150px',
        actions: [
          {
            icon: 'edit',
            key: 'edit',
            type: 'primary',
            callback: (item: any) => this.handleEdit(item),
          },
          {
            icon: 'delete',
            key: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.handleDelete(item),
          },
          {
            key: 'approve', label: 'Duyệt', type: 'primary',
            visible: (item: any) => this.authService.getUserRole() === 'admin' && item.approvalStatus === 'pending',
            callback: (item: any) => this.review(item, 'approved'),
          },
          {
            key: 'reject', label: 'Từ chối', type: 'default', danger: true,
            visible: (item: any) => this.authService.getUserRole() === 'admin' && item.approvalStatus === 'pending',
            callback: (item: any) => this.review(item, 'rejected'),
          },
        ],
      },
    ];
  }
  onStartDateChange(date: Date): void {
    this.startDate = date;
  }

  openModalCourse() {
    this.status = 'CREATE';
    this.isCourse = true;
    this.form.enable();
    this.form.reset();
    this.form.patchValue({ status: true, approvalStatus: 'approved' });
    if (this.authService.getUserRole() === 'teacher') {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      this.form.patchValue({ teacherId: user.id ?? user._id ?? user.userName, teacherName: user.userName, status: false, approvalStatus: 'pending' });
    }
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
          this.nzMessage.success('Cập nhật thành công', res);
          this.getAllCourses();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật thất bại');
          console.log('Update your errror : ', err);
        },
      });
    }

    this.courseId = null;
    this.isCourse = false;
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
            approvalStatus: courseData.approvalStatus ?? 'approved',
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

  review(item: any, approvalStatus: 'approved' | 'rejected'): void {
    this.courseService.reviewCourse(item._id, approvalStatus).subscribe({
      next: (response) => { this.nzMessage.success(response?.message ?? 'Đã cập nhật duyệt khóa học'); this.getAllCourses(); },
      error: (error) => this.nzMessage.error(error?.error?.message ?? 'Không cập nhật được duyệt khóa học'),
    });
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

  handlePageSize = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
