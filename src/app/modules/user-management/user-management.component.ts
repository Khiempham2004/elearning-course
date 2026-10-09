import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false,
})
export class UserManagementComponent implements OnInit {
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
      this.updatePagination();
      return;
    }

    this.filterSearch = this.users.filter((item: any) => {
      return item.fullName?.toLowerCase().includes(keywords);
    });

    this.page = 1;
    this.total = this.filterSearch.length;
    this.updatePagination();
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res ?? [];
        this.filterSearch = [...this.users];
        this.total = this.filterSearch.length;
        this.listOfUser = [
          ...this.users.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.updatePagination();
      },
    });
  }

  handleSubmit() {}

  handleEditUser(item: any) {
    this.status = 'EDIT';
    this.userId = item.id;
    this.isUser = true;

    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          userCode: res.userCode,
          fullName: res.fullName,
          email: res.email,
          phone: res.phone,
          role: res.role,
          departmentId: res.departmentId,
          // API/data hiện tại trả status dạng chuỗi "true"/"false";
          // ép về chuỗi để khớp nz-option ở form.
          status: res.status == null ? null : String(res.status),
        });
      },
    });
  }
  handleDeleteUser(item: any) {}

  optionSelects = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
