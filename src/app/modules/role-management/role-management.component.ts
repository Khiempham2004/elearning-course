import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleManagementService, RoleRecord } from './role-management.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  standalone: false,
})
export class RoleManagementComponent implements OnInit {
  readonly permissionOptions = [
    { id: '1', name: 'Xem danh sách' },
    { id: '2', name: 'Thêm mới' },
    { id: '3', name: 'Chỉnh sửa' },
    { id: '4', name: 'Xóa dữ liệu' },
    { id: '5', name: 'Phân quyền' },
    { id: '6', name: 'Quản lý khóa học' },
    { id: '7', name: 'Quản lý học viên' },
    { id: '8', name: 'Quản lý giảng viên' },
    { id: '9', name: 'Quản lý hệ thống' },
    { id: '10', name: 'Xem báo cáo' },
  ];
  readonly pageSizes = [5, 10, 15, 20].map((value) => ({
    label: String(value),
    value,
  }));

  form: FormGroup;
  roles: RoleRecord[] = [];
  loading = false;
  saving = false;
  isModalVisible = false;
  status: 'CREATE' | 'EDIT' = 'CREATE';
  selectedRoleId: string | null = null;
  keyword = '';
  page = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly roleService: RoleManagementService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
  ) {
    this.form = this.fb.group({
      roleCode: ['', [Validators.required, Validators.maxLength(30)]],
      roleName: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      permissionIds: [[]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  get modalTitle(): string {
    return this.status === 'CREATE' ? 'Tạo vai trò mới' : 'Cập nhật vai trò';
  }

  get activeRoleCount(): number {
    return this.roles.filter((role) => role.status !== false).length;
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles(this.page, this.pageSize, this.keyword).subscribe({
      next: (response) => {
        this.roles = response?.data ?? [];
        this.total = response?.pagination?.total ?? 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.message.error(error?.error?.message ?? 'Không tải được danh sách vai trò');
      },
    });
  }

  search(): void {
    this.page = 1;
    this.loadRoles();
  }

  pageChange(page: number): void {
    this.page = page;
    this.loadRoles();
  }

  pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.page = 1;
    this.loadRoles();
  }

  openCreate(): void {
    this.status = 'CREATE';
    this.selectedRoleId = null;
    this.form.reset({ roleCode: '', roleName: '', description: '', permissionIds: [], status: true });
    this.isModalVisible = true;
  }

  openEdit(role: RoleRecord): void {
    const id = role._id ?? role.id;
    if (!id) {
      this.message.error('Không xác định được mã vai trò');
      return;
    }
    this.status = 'EDIT';
    this.selectedRoleId = String(id);
    this.isModalVisible = true;
    this.roleService.getRole(this.selectedRoleId).subscribe({
      next: (response) => {
        const data = response?.data ?? response;
        this.form.patchValue({
          roleCode: data?.roleCode ?? '',
          roleName: data?.roleName ?? '',
          description: data?.description ?? '',
          permissionIds: (data?.permissionIds ?? []).map((value: unknown) => String(value)),
          status: data?.status ?? true,
        });
      },
      error: (error) => {
        this.isModalVisible = false;
        this.message.error(error?.error?.message ?? 'Không tải được thông tin vai trò');
      },
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedRoleId = null;
    this.form.reset({ roleCode: '', roleName: '', description: '', permissionIds: [], status: true });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Object.values(this.form.controls).forEach((control) => control.markAsDirty());
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      roleCode: String(this.form.value.roleCode).trim(),
      roleName: String(this.form.value.roleName).trim(),
      permissionIds: (this.form.value.permissionIds ?? []).map((value: unknown) => String(value)),
    };
    this.saving = true;
    const request = this.status === 'CREATE'
      ? this.roleService.createRole(payload)
      : this.roleService.updateRole(this.selectedRoleId!, payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.message.success(this.status === 'CREATE' ? 'Tạo vai trò thành công' : 'Cập nhật vai trò thành công');
        this.closeModal();
        this.loadRoles();
      },
      error: (error) => {
        this.saving = false;
        this.message.error(error?.error?.message ?? 'Không thể lưu vai trò');
      },
    });
  }

  deleteRole(role: RoleRecord): void {
    const id = role._id ?? role.id;
    if (!id) return;
    this.modal.confirm({
      nzTitle: `Xóa vai trò “${role.roleName}”?`,
      nzContent: 'Vai trò sẽ bị xóa khỏi danh sách.',
      nzOkText: 'Xóa vai trò',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: () => this.roleService.deleteRole(String(id)).subscribe({
        next: () => {
          this.message.success('Đã xóa vai trò');
          if (this.roles.length === 1 && this.page > 1) this.page--;
          this.loadRoles();
        },
        error: (error) => this.message.error(error?.error?.message ?? 'Không thể xóa vai trò'),
      }),
    });
  }

  permissionName(id: unknown): string {
    return this.permissionOptions.find((item) => item.id === String(id))?.name ?? String(id);
  }
}
