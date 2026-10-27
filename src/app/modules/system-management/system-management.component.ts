import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SystemService } from './system.service';

@Component({
  selector: 'app-system-management',
  templateUrl: './system-management.component.html',
  styleUrls: ['./system-management.component.css'],
  standalone: false,
})
export class SystemManagementComponent implements OnInit {
  filterSystem: string = '';
  listOfSystem: any[] = [];
  system: any[] = [];

  form!: FormGroup;
  status: 'CREATE' | 'EDIT' = 'CREATE';

  systemId: string | null = null;
  isSystem = false;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
    private systemService: SystemService,
  ) {
    this.form = this.fb.group({
      functionCode: ['', Validators.required],
      functionName: ['', Validators.required],
      directoryId: [null, Validators.required],
      functionType: ['PAGE', Validators.required],
      functionUrl: [''],
      description: [''],
      sortOrder: [1],
      status: [true, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllSystem();
  }
  get modalTitleRoom() {
    if (this.status === 'CREATE') {
      return 'Tạo mới hệ thống';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật hệ thống';
    }
    return '';
  }
  openModal() {
    this.isSystem = true;
    this.status = 'CREATE';
    this.systemId = null;
    this.form.reset();
  }

  closeModal() {
    this.isSystem = false;
    this.systemId = null;
    this.form.reset();
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllSystem();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllSystem();
  }

  handleClickSearch() {
    this.page = 1;
    this.getAllSystem();
  }
  getAllSystem() {
    this.systemService
      .getAllSystems(this.page, this.pageSize, this.filterSystem)
      .subscribe({
        next: (res: any) => {
          this.system = res?.data ?? [];
          this.listOfSystem = [...this.system];
          this.total = res?.pagination?.total ?? 0;
        },
        error: () =>
          this.nzMessage.error('Không thể tải danh sách chức năng hệ thống'),
      });
  }

  handleSubmitRoom() {
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
      this.systemService.createSystem(payload).subscribe({
        next: () => {
          this.nzMessage.success('Tạo mới hệ thống thành công');
          this.page = 1;
          this.closeModal();
          this.getAllSystem();
        },
        error: (err: any) => {
          this.nzMessage.error(err?.error?.message || 'Lỗi tạo mới hệ thống');
        },
      });
    } else {
      if (!this.systemId) {
        this.nzMessage.error('Không xác định được chức năng cần cập nhật');
        return;
      }
      this.systemService.updateSystem(this.systemId, payload).subscribe({
        next: () => {
          this.nzMessage.success('Cập nhật hệ thống thành công');
          this.closeModal();
          this.getAllSystem();
        },
        error: (err: any) => {
          this.nzMessage.error(err?.error?.message || 'Lỗi cập nhật hệ thống');
        },
      });
    }
  }

  handleEdit(item: any) {
    this.status = 'EDIT';
    this.isSystem = true;
    const id = item._id ?? item.id;
    if (!id) {
      this.nzMessage.error('Không xác định được chức năng cần chỉnh sửa');
      this.closeModal();
      return;
    }
    this.systemId = String(id);
    this.systemService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        const systemData = res?.data;
        if (!systemData) {
          this.nzMessage.error('Không tìm thấy chức năng hệ thống');
          this.closeModal();
          return;
        }
        this.form.patchValue({
          functionCode: systemData.functionCode,
          functionName: systemData.functionName,
          directoryId: systemData.directoryId,
          functionType: systemData.functionType,
          functionUrl: systemData.functionUrl,
          description: systemData.description,
          sortOrder: systemData.sortOrder,
          status: systemData.status,
        });
      },
      error: (err: any) => {
        this.nzMessage.error(
          err?.error?.message || 'Không thể tải chức năng hệ thống',
        );
        this.closeModal();
      },
    });
  }

  handleDelete(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa chức năng hệ thống này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.systemService.deleteSystem(item._id ?? item.id).subscribe({
          next: () => {
            this.nzMessage.success('Xóa chức năng hệ thống thành công');
            this.getAllSystem();
          },
          error: (err: any) => {
            this.nzMessage.error(
              err?.error?.message || 'Lỗi xóa chức năng hệ thống',
            );
          },
        });
      },
    });
  }
  handleRowClick(item: any) {
    this.handleEdit(item);
  }

  handleOptionSelect = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
