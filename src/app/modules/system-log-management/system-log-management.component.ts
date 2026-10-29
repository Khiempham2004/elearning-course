import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemLogService } from './systemLog.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataTableColumn } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-system-log-management',
  templateUrl: './system-log-management.component.html',
  styleUrls: ['./system-log-management.component.css'],
  standalone: false,
})
export class SystemLogManagementComponent implements OnInit {
  dataTable: DataTableColumn<any>[] = [];
  isSystemLog = false;
  status: 'CREATE' | 'EDIT' = 'CREATE';
  form!: FormGroup;
  systemId: any = null;
  systemLog: any[] = [];
  listOfSystemLog: any[] = [];
  filter: string = '';

  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private systemlogService: SystemLogService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      logCode: [null],
      userId: [null],
      userName: [null, [Validators.required]],
      action: [null, [Validators.required]],
      module: [null],
      description: [null, [Validators.required]],
      ipAddress: [null],
      createdAt: [new Date()],
    });
  }

  ngOnInit() {
    this.initialDataTable();
    this.getAllSystems();
  }

  initialDataTable() {
    this.dataTable = [
      {
        title: 'Mã nhật ký',
        key: 'logCode',
        width: '150px',
      },
      {
        title: 'ID người thực hiện',
        key: 'userId',
        width: '150px',
      },
      {
        title: 'Tên người thực hiện',
        key: 'userName',
        width: '150px',
      },
      {
        title: 'Hành động',
        key: 'action',
        width: '150px',
      },
      {
        title: 'Chức năng được thao tác',
        key: 'module',
        width: '150px',
      },
      {
        title: 'Nội dung chi tiết',
        key: 'description',
        width: '150px',
      },
      {
        title: 'Địa chỉ IP thực hiện',
        key: 'ipAddress',
        width: '150px',
      },
      {
        title: 'Trạng thái',
        key: 'createdAt',
        width: '150px',
        dateFormat: 'dd/MM/yyyy',
      },
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
        ],
      },
    ];
  }

  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới nhật ký hệ thống';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật nhật ký hệ thống';
    }
    return '';
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllSystems();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllSystems();
  }

  getAllSystems() {
    this.systemlogService
      .getAllSystemLog(this.page, this.pageSize, this.filter)
      .subscribe({
        next: (res: any) => {
          this.systemLog = res?.data ?? [];
          this.listOfSystemLog = [...this.systemLog];
          this.total = res?.pagination?.total ?? 0;
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
      this.systemlogService.createSystemLog(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới nhật ký hệ thống thành công', res);
          this.closeModal();
          this.page = 1;
          this.getAllSystems();
        },
        error: (err: any) => {
          this.nzMessage.error(err);
        },
      });
    } else {
      this.systemlogService.putSystemLog(this.systemId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật nhật ký hệ thống thành công', res);
          this.getAllSystems();
        },
        error: (err: any) => {
          this.nzMessage.error(err);
        },
      });
    }
    this.isSystemLog = false;
    this.systemId = null;
    this.getAllSystems();
    this.form.reset();
  }
  openModal() {
    this.isSystemLog = true;
    this.status = 'CREATE';
    this.form.reset();
  }

  closeModal() {
    this.isSystemLog = false;
    this.systemId = null;
    this.form.reset();
  }

  handleEdit(item: any) {
    this.status = 'EDIT';
    this.systemId = item._id ?? item.id;
    this.isSystemLog = true;
    this.systemlogService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        const systemData = res?.data;
        this.form.patchValue(systemData);
        this.getAllSystems();
      },
      error: (err: any) => {
        this.nzMessage.error(err);
      },
    });
  }
  handleDelete(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa nhật ký hệ thống này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.systemlogService.deleteSystemLog(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa nhật ký hệ thống thành công', res);
            this.getAllSystems();
          },
        });
      },
    });
  }

  getRawCLick(item: any) {
    this.status === 'EDIT';
    this.systemId = item._id ?? item.id;
    this.isSystemLog = true;
    this.systemlogService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        const systemData = res?.data;
        this.form.patchValue(systemData);
        this.getAllSystems();
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
