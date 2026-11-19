import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminUsersService } from './admin-users.service';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSelectComponent } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, NzPaginationComponent, NzSelectComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  readonly users = signal<any[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly modalOpen = signal(false);
  keyword = '';
  roleFilter = '';
  statusFilter = '';
  editingId = '';
  form: any = this.emptyForm();

  constructor(private readonly service: AdminUsersService) {}
  ngOnInit(): void {
    this.load();
  }

  private emptyForm() {
    return {
      userName: '',
      email: '',
      password: '',
      role: 'student',
      status: true,
    };
  }
  load(): void {
    this.loading.set(true);
    this.service
      .list(
        this.page(),
        this.pageSize(),
        this.keyword,
        this.roleFilter,
        this.statusFilter,
      )
      .subscribe({
        next: (response) => {
          this.users.set(response.data ?? []);
          this.total.set(response.pagination?.total ?? 0);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error?.error?.message ?? 'Không tải được tài khoản.');
          this.loading.set(false);
        },
      });
  }
  search(): void {
    this.page.set(1);
    this.load();
  }
  changePage(page: number): void {
    this.page.set(page);
    this.load();
  }
  changePageSize(pagesize: number): void {
    this.pageSize.set(pagesize);
    this.page.set(1);
    this.load();
  }
  openCreate(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.modalOpen.set(true);
  }
  openEdit(user: any): void {
    this.editingId = user._id;
    this.form = {
      userName: user.userName,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    };
    this.modalOpen.set(true);
  }
  close(): void {
    this.modalOpen.set(false);
  }
  save(): void {
    this.error.set('');
    if (
      !this.form.userName.trim() ||
      !this.form.email.trim() ||
      !this.form.role ||
      (!this.editingId && this.form.password.length < 8) ||
      (this.form.password && this.form.password.length < 8)
    ) {
      this.error.set(
        'Nhập đủ tên đăng nhập, email, role và mật khẩu tối thiểu 8 ký tự khi tạo/đổi mật khẩu.',
      );
      return;
    }
    const payload = { ...this.form };
    if (this.editingId && !payload.password) delete payload.password;
    const request = this.editingId
      ? this.service.update(this.editingId, payload)
      : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.close();
        this.load();
      },
      error: (error) =>
        this.error.set(error?.error?.message ?? 'Không lưu được tài khoản.'),
    });
  }
  toggleStatus(user: any): void {
    this.service.update(user._id, { status: !user.status }).subscribe({
      next: () => this.load(),
      error: (error) =>
        this.error.set(
          error?.error?.message ?? 'Không cập nhật được trạng thái.',
        ),
    });
  }
  remove(user: any): void {
    if (!window.confirm(`Xóa tài khoản “${user.userName}”?`)) return;
    this.service.remove(user._id).subscribe({
      next: () => this.load(),
      error: (error) =>
        this.error.set(error?.error?.message ?? 'Không xóa được tài khoản.'),
    });
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  }

   optionAdminUsers = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
