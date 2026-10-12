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
  filterSearch: any[] = [];

  form!: FormGroup;
  status: 'CREATE' | 'EDIT' = 'CREATE';

  systemId: any = null;
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

  pageChange(page: any) {
    this.page = page;
    this.getAllSystem();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllSystem();
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfSystem = this.filterSearch.slice(start, end);
  }
  handleClickSearch() {
    const keyword = this.filterSystem.trim().toLowerCase();
    if (!keyword) {
      this.filterSearch = [...this.system];
      this.total = this.filterSearch.length;
      this.page = 1;
      this.updatePagination();
      return;
    }

    this.filterSearch = this.system.filter((item: any) => {
      return (
        item.functionName?.toLowerCase().includes(keyword) ||
        item.functionType?.toLowerCase().includes(keyword)
      );
    });

    this.total = this.filterSearch.length;
    this.page = 1;
    this.updatePagination();
  }
  getAllSystem() {
    this.systemService.getAllSystems().subscribe({
      next: (res: any) => {
        this.system = res ?? [];
        this.filterSearch = [...this.system];
        this.total = this.filterSearch.length;
        this.listOfSystem = [
          ...this.system.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.updatePagination();
      },
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
        next: (res: any) => {
          this.nzMessage.success('Tạo mới hệ thống thành công', res);
          this.getAllSystem();
        },
        error: (err: any) => {
          this.nzMessage.error('Lỗi tạo mới hệ thống', err);
        },
      });
    } else {
      this.systemService.updateSystem(this.systemId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật hệ thống thành công', res);
          this.getAllSystem();
        },
      });
    }

    this.isSystem = false;
    this.systemId = null;
    this.getAllSystem();
    this.form.reset();
  }

  handleEdit(item: any) {
    this.status = 'EDIT';
    this.isSystem = true;
    this.systemId = item.id;
    this.systemService.getSystemById(this.systemId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          functionCode: res?.functionCode,
          functionName: res?.functionName,
          directoryId: res?.directoryId,
          functionType: res?.functionType,
          functionUrl: res?.functionUrl,
          description: res?.description,
          sortOrder: res?.sortOrder,
          status: res.status == null ? null : String(res.status),
        });
        this.getAllSystem();
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
        this.systemService.deleteSystem(item.id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khoá học thành công', res);
            this.getAllSystem();
          },
        });
      },
    });
  }
  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.isSystem = true;
    this.systemService.getSystemById(item.id).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
      },
    });
  }

  handleOptionSelect = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
