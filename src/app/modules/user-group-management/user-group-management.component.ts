import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../user-management/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-group-management',
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.css'],
  standalone: false,
})
export class UserGroupManagementComponent implements OnInit {
  users: any[] = [];
  listOfUsers: any[] = [];
  listOfPermissions : any[]=[];
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
    private nzMessage : NzMessageService
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
    this.status === 'CREATE';
    this.form.reset();
  }
  closeModal() {
    this.isUsers = false;
    this.userId = null;
    this.form.reset();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next : (res:any) => {
        this.users = res ?? [];
        this.listOfUsers = [...this.users];
        this.total = this.users.length;
      }
    })
  }
  handleSubmit() {}
  userEdit(item: any) {}

  userDelete(item: any) {}
}
