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

  systemId: any = null;
  isSystem = false;
  page = 1;
  pageSize = 10;
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
      status: ['ACTIVE', Validators.required],
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
  handleClickSearch() {}
  openModal() {
    this.isSystem = true;
    this.status = 'CREATE';
    this.form.reset();
  }

  closeModal() {
    this.isSystem = false;
    this.systemId = null;
    this.form.reset();
  }

  getAllSystem() {
    this.systemService.getAllSystems().subscribe({
      next: (res: any) => {
        this.system = res ?? [];
        this.listOfSystem = [
          ...this.system.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.system.length;
      },
    });
  }

  handleSubmitRoom() {}
  handleEdit(item: any) {
    this.status = 'EDIT';
    this.isSystem = true;
    this.systemId = item.id;
    this.systemService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          functionCode : res?.functionCode,
          functionName : res?.functionName,
          directoryId : res?.directoryId,
          functionType : res?.functionType,
          functionUrl : res?.functionUrl,
          description : res?.description,
          sortOrder : res?.sortOrder,
          status: res.status == null ? null : String(res.status),
        });
        this.getAllSystem();
      },
    });
  }

  handleDelete(item: any) {}
  handleRowClick(item: any) {}
}
