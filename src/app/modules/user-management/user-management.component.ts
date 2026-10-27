import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataTableColumn } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false,
})
export class UserManagementComponent implements OnInit {
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<{ $implicit: any }>;
  tableColumns: DataTableColumn<any>[] = [];
  form!: FormGroup;
  status: 'CREATE' | 'EDIT' = 'CREATE';
  users: any[] = [];
  listOfUser: any[] = [];
  filterUser: string = '';

  filterSearch: any[] = [];
  userId: any = null;
  isUser = false;
  page = 1;
  pageSize = 10;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      userCode: [null],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      role: [null],
      departmentId: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.tableColumns = [
      { title: 'Mã người dùng', key: 'userCode' },
      { title: 'Họ và tên', key: 'fullName' },
      { title: 'Email', key: 'email' },
      { title: 'Số điện thoại', key: 'phone' },
      { title: 'Vai trò', key: 'role' },
      { title: 'Mã phòng ban', key: 'departmentId' },
      { title: 'Trạng thái', key: 'status' },
      { title: 'Hoạt động', key: 'actions', width: '120px', template: this.actionTemplate, align: 'center' },
    ];
    this.getAllUsers();
  }


  get modalTitleUser() {
    if (this.status === 'CREATE') {
      return 'Thêm mới người dùng';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật người dùng';
    }
    return '';
  }
  openModal() {
    this.isUser = true;
    this.status = 'CREATE';
    this.form.reset();
  }

  closeModal() {
    this.isUser = false;
    this.userId = null;
    this.form.reset();
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllUsers();
  }
  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllUsers();
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfUser = this.filterSearch.slice(start, end);
  }
  handleClickSearch() {
    const keywords = this.filterUser.trim().toLowerCase();
    console.log(keywords);

    if (!keywords) {
      this.filterSearch = [...this.users];
      this.total = this.filterSearch.length;
      this.page = 1;
      this.getAllUsers();
      return;
    }

    this.filterSearch = this.users.filter((item: any) => {
      return item.fullName?.toLowerCase().includes(keywords);
    });

    this.page = 1;
    this.total = this.filterSearch.length;
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService
      .getAllUsers(this.page, this.pageSize, this.filterUser)
      .subscribe({
        next: (res: any) => {
          this.users = res?.data ?? [];
          this.listOfUser = [...this.users];
          this.total = res?.pagination?.total || 0;
        },
      });
  }

  handleSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.form.markAllAsTouched();
        }
      });
      return;
    }

    const payload = this.form.getRawValue();

    if (this.status === 'CREATE') {
      this.userService.createUsers(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới người dùng thành công', res);
          this.getAllUsers();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo mới thất bại', err);
        },
      });
    } else {
      this.userService.updateUser(this.userId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật người dùng thành công', res);
          this.getAllUsers();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật thất bại', err);
        },
      });
    }

    this.isUser = false;
    this.userId = null;
    this.getAllUsers();
    this.form.reset();
  }

  handleEditUser(item: any) {
    this.status = 'EDIT';
    this.userId = item._id ?? item.id;
    this.isUser = true;

    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        const userData = res?.data || [];
        if (!userData) {
          return;
        }
        if (userData) {
          this.form.patchValue({
            userCode: userData?.userCode,
            fullName: userData?.fullName,
            email: userData?.email,
            phone: userData?.phone,
            role: userData?.role,
            departmentId: userData?.departmentId,
            // API/data hiện tại trả status dạng chuỗi "true"/"false";
            // ép về chuỗi để khớp nz-option ở form.
            // status: userData?.status == null ? null : String(userData?.status),
            status :userData?.status
          });
        }
      },
    });
  }
  handleDeleteUser(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa cấp tỉnh này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.userService.deleteUser(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khoá học thành công', res);
            this.getAllUsers();
          },
        });
      },
    });
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.isUser = true;
    this.userService.getUserById(item._id).subscribe({
      next: (res: any) => {
        const userData = res?.data;
        if (!userData) {
          return;
        }
        this.form.patchValue(userData);
        this.getAllUsers();
      },
    });
  }

  optionSelects = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
