import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from './configuration.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataTableColumn } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-configuration-management',
  templateUrl: './configuration-management.component.html',
  styleUrls: ['./configuration-management.component.css'],
  standalone: false,
})
export class ConfigurationManagementComponent implements OnInit {
  dataTable: DataTableColumn<any>[] = [];
  form!: FormGroup;
  status: 'CREATE' | 'EDIT' = 'CREATE';
  isConfigration = false;
  configrationId: any = null;
  listOfConfiguration: any = [];
  listOfCategory: any = [];
  configuration: any = [];
  filter: string = '';
  lisfOfFilter: any = [];

  type: any[] = [];
  group: any[] = [];
  listOfType: any[] = [];
  listOfGroup: any[] = [];

  page = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      configKey: [null, [Validators.required]],
      configName: [null, [Validators.required]],
      configValue: [null, [Validators.required]],
      configType: [null],
      category: [null, [Validators.required]],
      description: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.initialDataTable();
    this.getAllConfiguration();
    this.getAllType();
    this.getAllGroup();
  }

  initialDataTable() {
    this.dataTable = [
      {
        title: 'Mã cấu hình',
        key: 'configKey',
        width: '150px',
      },
      {
        title: 'Tên cấu hình',
        key: 'configName',
        width: '150px',
      },
      {
        title: 'Giá trị cấu hình',
        key: 'configValue',
        width: '150px',
      },
      {
        title: 'Loại cấu hình',
        key: 'configType',
        width: '150px',
      },
      {
        title: 'Nhóm cấu hình',
        key: 'category',
        width: '150px',
      },
      {
        title: 'Mô tả',
        key: 'description',
        width: '150px',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: '150px',
      },
      {
        title: 'Hành động',
        key: 'action',
        width: '150px',
        actions: [
          {
            key: 'edit',
            icon: 'edit',
            type: 'primary',
            callback: (item: any) => this.handleConfigurationEdit(item),
          },
          {
            key: 'delete',
            icon: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.handleConfigurationDelete(item),
          },
        ],
      },
    ];
  }

  pageChange(page: any) {
    this.page = page;
    this.getAllConfiguration();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllConfiguration();
  }

  upLoadPagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfConfiguration = this.lisfOfFilter.slice(start, end);
  }

  handleFilter() {
    const keyword = this.filter.trim().toLowerCase();
    if (!keyword) {
      this.lisfOfFilter = [...this.configuration];
      this.total = this.lisfOfFilter.length;
      this.page = 1;
      this.upLoadPagination();
      return;
    }

    this.lisfOfFilter = this.configuration.filter((item: any) => {
      return item.configName?.toLowerCase().includes(keyword);
    });
    this.total = this.lisfOfFilter.length;
    this.page = 1;
    this.upLoadPagination();
  }
  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới hệ thống';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật hệ thống';
    }
    return '';
  }
  openModal() {
    this.status = 'CREATE';
    this.isConfigration = true;
    this.form.reset();
  }
  closeModal() {
    this.configrationId = null;
    this.isConfigration = false;
    this.form.reset();
  }

  getAllConfiguration() {
    this.configurationService
      .getAllConfiguration(this.page, this.pageSize, this.filter)
      .subscribe({
        next: (res: any) => {
          console.log(res);

          this.configuration = res?.data ?? [];
          this.listOfConfiguration = [...this.configuration];
          this.total = res?.pagination?.total || 0;
        },
      });
  }

  getAllType() {
    this.configurationService.getAllType().subscribe({
      next: (res: any) => {
        this.type = res ?? [];
        this.listOfType = [...this.type];
      },
    });
  }

  getAllGroup() {
    this.configurationService.getAllGroup().subscribe({
      next: (res: any) => {
        this.group = res ?? [];
        this.listOfGroup = [...this.group];
      },
    });
  }

  // Select sử dụng tên làm nzValue, nên đổi ID từ API về tên option trước khi patch.
  private toSelectNames(value: any, options: any[], labelKey: string): any[] {
    const values = Array.isArray(value)
      ? value
      : value == null || value === ''
        ? []
        : [value];

    return values
      .map((selected: any) => {
        const selectedText = String(selected).trim();
        const option =
          options.find((item: any) => String(item.id) === selectedText) ??
          options.find(
            (item: any) => String(item[labelKey] ?? '').trim() === selectedText,
          );
        return option ? option[labelKey] : selectedText;
      })
      .filter(Boolean);
  }

  private toSelectArray(value: any): any[] {
    if (value == null || value === '') return [];
    return Array.isArray(value) ? value : [value];
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
      this.configurationService.createConfiguration(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo cấu hình hệ thống thành công');
          this.closeModal();
          this.page = 1;
          this.getAllConfiguration();
        },
        error: (err: any) => {
          this.nzMessage.error(
            err?.error?.message ?? 'Không thể tạo cấu hình hệ thống',
          );
        },
      });
    } else {
      this.configurationService
        .putConfiguration(this.configrationId, payload)
        .subscribe({
          next: (res: any) => {
            this.nzMessage.success('Cập nhật cấu hình hệ thống thành công');
            this.closeModal();
            this.getAllConfiguration();
          },
          error: (err: any) => {
            this.nzMessage.error(
              err?.error?.message ?? 'Không thể cập nhật cấu hình hệ thống',
            );
          },
        });
    }
  }
  handleConfigurationEdit(item: any) {
    this.status = 'EDIT';
    this.isConfigration = true;
    this.configrationId = item._id ?? item.id;
    this.configurationService
      .getConfigurationById(this.configrationId)
      .subscribe({
        next: (res: any) => {
          const confiData = res?.data;
          this.form.patchValue({
            configKey: (confiData?.data ?? confiData)?.configKey,
            configName: (confiData?.data ?? confiData)?.configName,
            configValue: (confiData?.data ?? confiData)?.configValue,
            configType: this.toSelectNames(
              (confiData?.data ?? confiData)?.configType,
              this.listOfType,
              'configType',
            ),
            category: this.toSelectNames(
              (confiData?.data ?? confiData)?.category,
              this.listOfGroup,
              'category',
            ),
            description: (confiData?.data ?? confiData)?.description,
            status: (confiData?.data ?? confiData)?.status,
          });
        },
      });
  }
  handleConfigurationDelete(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa cấu hình hệ thống này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.configurationService.deleteConfiguration(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa người dùng thành công',res);
            this.getAllConfiguration();
          },
        });
      },
    });
  }

  handleRawClick(item: any) {
    this.status = 'EDIT';
    this.configrationId = item._id ?? item.id;
    this.isConfigration = true;

    this.configurationService
      .getConfigurationById(this.configrationId)
      .subscribe({
        next: (res: any) => {
          const confiData = res?.data;
          this.form.patchValue(confiData);
          this.getAllConfiguration();
        },
      });
  }

  optionSelect = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
