import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../user-management/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserGroupService } from './userGroup.service';
import { DataTableColumn } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-user-group-management',
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.css'],
  standalone: false,
})
export class UserGroupManagementComponent implements OnInit {
  dataTable: DataTableColumn<any>[] = [];
  users: any[] = [];
  permissionName: any[] = [];
  group: any[] = [];
  listOfGroupnames: any[] = [];
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
    private userService: UserGroupService,
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
      permissionName: [[]],
    });
  }

  ngOnInit() {
    this.initialDataTable();
    this.getAllUsers();
    this.getAllGroupName();
    this.getAllPermissionName();
  }

  initialDataTable() {
    this.dataTable = [
      {
        title: 'Mã nhóm',
        key: 'groupCode',
        width: '150px',
      },
      {
        title: 'Tên nhóm',
        key: 'groupName',
        width: '150px',
      },
      {
        title: 'Mô tả',
        key: 'description',
        width: '150px',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: '150px',
      },
      {
        title: 'Mã người dùng',
        key: 'userIds',
        width: '150px',
      },
      {
        title: 'Mã quyền',
        key: 'permissionIds',
        width: '150px',
      },
      {
        title: 'Hành động',
        key: 'action',
        width: '150px',
        actions: [
          {
            key: 'edit',
            icon: 'edit',
            type: 'primary',
            callback: (item: any) => this.userEdit(item),
          },
          {
            key: 'delete',
            icon: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.userDelete(item),
          },
        ],
      },
    ];
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

  getUserName(userIds: string[]): string {
    return (userIds ?? [])
      .map((id) => {
        const user = this.listOfUsers.find(
          (item) => String(item.id) === String(id).trim(),
        );
        return user?.groupName;
      })
      .filter((name) => !!name)
      .join(', ');
  }
  getAllUsers() {
    this.userService
      .getAllUser(this.page, this.pageSize, this.filterSearch)
      .subscribe({
        next: (res: any) => {
          this.users = res?.data ?? [];
          this.listOfUsers = [...this.users];
          this.total = res?.pagination?.total || 0;
        },
      });
  }

  getAllGroupName() {
    this.userService.getAllGroupName().subscribe({
      next: (res: any) => {
        this.group = res ?? [];
        this.listOfGroupnames = [...this.group];
      },
    });
  }

  getAllPermissionName() {
    this.userService.getAllPermissionName().subscribe({
      next: (res: any) => {
        this.permissionName = res ?? [];
        this.listOfPermissions = [...this.permissionName];
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
      const { id, ...createPayload } = payload;
      this.userService.createUser(createPayload).subscribe({
        next: (res: any) => {
          this.nzMessage.success(
            `Tạo mới người dùng thành công ID : ${res.id}`,
            res,
          );
          this.closeModal();
          this.page = 1;
          this.getAllUsers();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo người dùng thất bại', err);
        },
      });
    } else {
      this.userService.putUser(this.userId, payload).subscribe({
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
    this.status = 'EDIT';
    this.isUsers = true;
    this.userId = item._id ?? item.id;
    console.log(item);

    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        const userData = res?.data;
        if (!userData) {
          return;
        }
        if (userData) {
          this.form.patchValue({
            groupCode: userData?.groupCode,
            groupName: userData?.groupName,
            description: userData?.description,
            status: String(userData?.status),
            userIds: (userData?.userIds ?? []).map((id: any) =>
              String(id).trim(),
            ),
            permissionIds: (userData?.permissionIds ?? []).map((id: any) =>
              String(id).trim(),
            ),
          });
        }
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
        this.userService.deleteUser(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa người dùng thành công', res);
            this.getAllUsers();
          },
        });
      },
    });
  }

  handleRowClick(item: any) {
    this.userEdit(item);
  }

  handleOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
