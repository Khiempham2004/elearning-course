import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../user-management/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-group-management',
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.css'],
  standalone: false,
})
export class UserGroupManagementComponent implements OnInit {
  users: any[] = [];
  listOfUsers: any[] = [];
  listOfPermissions: any[] = [];
  filters: any[] = [];
  filterSearch: string = '';
  
  status: 'CREATE' | 'EDIT' = 'CREATE';
  isUsers = false;
  userId: any = null;

  form!: FormGroup;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      groupCode: ['', Validators.required],
      groupName: ['', Validators.required],
      description: [''],
      status: ['true'],
      userIds: [[]],
      permissionIds: [[]],
    });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới người dùng';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật người dùng';
    }
    return '';
  }

  openModal() {
    this.isUsers = true;
    this.status = 'CREATE';
    this.form.reset();
  }
  closeModal() {
    this.isUsers = false;
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
    this.listOfUsers = this.filters.slice(start, end);
  }
  search() {
    const keywords = this.filterSearch.toLowerCase().trim();
    if (!keywords) {
      this.filters = [...this.users];
      this.total = this.filters.length;
      this.page = 1;
      this.updatePagination();
      return;
    }

    this.filters = this.users.filter((item: any) => {
      return item.groupName?.toLowerCase().includes(keywords);
    });
    this.total = this.filters.length;
    this.page = 1;
    this.updatePagination();
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res ?? [];
        this.filters = [...this.users];
        this.total = this.filters.length;
        this.listOfUsers = [
          ...this.users.slice( 
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        console.log(this.listOfUsers);

        this.listOfPermissions = [...this.users];
        // this.total = this.users.length;
        this.updatePagination();
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
          this.nzMessage.error('Tạo người dùng thất bại', err);
        },
      });
    } else {
      this.userService.updateUser(this.userId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật nhóm người dùng thành công', res);
          this.getAllUsers();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật nhóm người dùng thất bại');
        },
      });
    }
    this.isUsers = false;
    this.userId = null;
    this.getAllUsers();
    this.form.reset();
  }
  userEdit(item: any) {
    console.log(item.id);

    this.status = 'EDIT';
    this.isUsers = true;
    this.userId = item.id;
    console.log(item);

    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.form.patchValue({
          groupCode: res?.groupCode,
          groupName: res?.groupName,
          description: res?.description,
          status: res?.status,
          userIds: (res?.userIds ?? []).map((id: any) => String(id).trim()),
          permissionIds: (res?.permissionIds ?? []).map((id: any) =>
            String(id).trim(),
          ),
        });
        console.log(this.form);
        this.getAllUsers();
      },
    });
  }

  userDelete(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa người dùng này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.userService.deleteUser(item.id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa người dùng thành công');
            this.getAllUsers();
          },
        });
      },
    });
  }

  handleOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
