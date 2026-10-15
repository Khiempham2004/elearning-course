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

  getAllSystems() {
    this.systemlogService.getAllSystemLog().subscribe({
      next : (res:any) => {
        this.systemLog = res;
        this.listOfSystemLog = [...this.systemLog];
      }
    })
  }
  handleSubmit() {}
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

  handleEdit(item:any){}
  handleDelete(item:any){}
}
