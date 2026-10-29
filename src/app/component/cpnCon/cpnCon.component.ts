import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinceLevelService } from '../service/province-level.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  DataTableAction,
  DataTableColumn,
} from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-cpnCon',
  templateUrl: './cpnCon.component.html',
  styleUrls: ['./cpnCon.component.css'],
  standalone: false,
})
export class CpnConComponent implements OnInit {
  filterSearch: string = '';
  form!: FormGroup;
  isProvince = false;
  province: any = [];
  listOfProvince: DataTableColumn[] = [];
  filteredProvinces: any[] = [];
  status: 'CREATE' | 'EDIT' | 'DETAIL' = 'CREATE';
  provinceId: any = null;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private provinceService: ProvinceLevelService,
    private nzMessage: NzMessageService,
    private nzSpinner: NzSpinModule,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      provinceCode: ['', [Validators.required]],
      provinceName: ['', [Validators.required]],
      provinceType: ['', [Validators.required]],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.initialTableColumns();
    this.getAllProvince();
  }

  initialTableColumns() {
    this.listOfProvince = [
      {
        title: 'Mã tỉnh',
        key: 'provinceCode',
        width: '150px',
        align: 'center',
      },
      {
        title: 'Tên tỉnh',
        key: 'provinceName',
        width: '200px',
        align: 'center',
      },
      {
        title: 'Loại đơn vị',
        key: 'provinceType',
        width: '150px',
        align: 'center',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: '100px',
        align: 'center',
      },
      {
        title: 'Hành động',
        key: 'action',
        width: '150px',
        height : '100px',
        align: 'center',
        actions: [
          {
            key: 'edit',
            icon: 'edit',
            type: 'primary',
            callback: (item: any) => this.editProvince(item),
          },
          {
            key: 'delete',
            icon: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.deleteProvince(item),
          },
        ],
      },
    ];
  }

  handleActionClick(event: { action: DataTableAction; row: any }) {
    switch (event.action.key) {
      case 'edit':
        this.editProvince(event.row);
        break;
      case 'delete':
        this.deleteProvince(event.row);
        break;
    }
  }

  get modalTitle(): string {
    if (this.status === 'CREATE') {
      return 'Thêm mới tỉnh/thành phố';
    }
    if (this.status === 'EDIT') {
      return 'Chỉnh sửa tỉnh/thành phố';
    }
    if (this.status === 'DETAIL') {
      return 'Chi tiết tỉnh/thành phố';
    }
    return '';
  }

  pageChange(event: any) {
    this.page = event;
    this.getAllProvince();
  }

  pageSizeChange(event: any) {
    this.pageSize = event;
    this.page = 1;
    this.getAllProvince();
  }

  handleSearch(): void {
    const keyword = this.filterSearch.trim().toLocaleLowerCase();
    this.filteredProvinces = this.province.filter((item: any) =>
      [item.provinceCode, item.provinceName].some((value) =>
        String(value ?? '')
          .toLocaleLowerCase()
          .includes(keyword),
      ),
    );
    this.page = 1;
    this.getAllProvince();
  }

  private updateProvincePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.total = this.filteredProvinces.length;
    this.listOfProvince = this.filteredProvinces.slice(
      start,
      start + this.pageSize,
    );
  }

  createNewProvince(): void {
    this.status = 'CREATE';
    this.isProvince = true;
    this.provinceId = null;
    this.form.enable();
    this.form.reset();
  }

  handleCancel(): void {
    this.isProvince = false;
    this.status = 'CREATE';
    this.provinceId = null;
    this.form.reset();
  }

  getAllProvince(): void {
    this.provinceService
      .getAllProvinces(this.page, this.pageSize, this.filterSearch)
      .subscribe({
        next: (res: any) => {
          this.province = res?.data || [];
          this.total = res?.pagination?.totalPagination || 0;
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
      this.provinceService.createProvince(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới cấp tỉnh thành công', res);
          this.getAllProvince();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo mới thất bại');
        },
      });
    } else {
      this.provinceService.updateProvince(this.provinceId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật cấp tỉnh thành công', res);
          this.getAllProvince();
        },
      });
    }

    this.provinceId = null;
    this.isProvince = false;
    this.getAllProvince();
    this.form.reset();
  }

  editProvince(item: any): void {
    this.isProvince = true;
    this.status = 'EDIT';
    this.provinceId = item.id;
    this.form.enable();
    this.form.reset();
    this.provinceService.getProvinceById(this.provinceId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          provinceCode: res.provinceCode,
          provinceName: res.provinceName,
          provinceType: res.provinceType,
          status: res.status,
        });
      },
    });
    this.getAllProvince();
  }

  deleteProvince(item: any): void {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa cấp tỉnh này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.provinceService.deleteProvince(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khoá học thành công', res);
            this.getAllProvince();
          },
        });
      },
    });
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.provinceId = item._id ?? item.id;
    this.isProvince = true;
    this.provinceService.getProvinceById(this.provinceId).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
        this.getAllProvince();
      },
    });
  }

  handlePageSizeOption = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
