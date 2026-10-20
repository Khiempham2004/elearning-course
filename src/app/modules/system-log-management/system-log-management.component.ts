import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemLogService } from './systemLog.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-system-log-management',
  templateUrl: './system-log-management.component.html',
  styleUrls: ['./system-log-management.component.css'],
  standalone: false,
})
export class SystemLogManagementComponent implements OnInit {
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
      createdAt: [null],
    });
  }

  ngOnInit() {
    this.getAllSystems();
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
    this.systemlogService.getAllSystemLog().subscribe({
      next: (res: any) => {
        this.systemLog = res;
        this.listOfSystemLog = [
          ...this.systemLog.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.systemLog.length;
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
          this.nzMessage.success('Tạo mới nhật ký hệ thống thành công');
          this.getAllSystems();
        },
        error: (err: any) => {
          this.nzMessage.error(err);
        },
      });
    } else {
      this.systemlogService.putSystemLog(this.systemId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật nhật ký hệ thống thành công');
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
    this.systemId = item.id;
    this.isSystemLog = true;
    this.systemlogService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
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
        this.systemlogService.deleteSystemLog(item.id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khoá học thành công', res);
            this.getAllSystems();
          },
        });
      },
    });
  }

  getRawCLick(item: any) {
    this.status === 'EDIT';
    this.isSystemLog = true;

    this.systemlogService.getSystemById(item.id).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
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
