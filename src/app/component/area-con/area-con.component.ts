import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictrictLevelService } from '../service/dictrict-level';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  DataTableAction,
  DataTableColumn,
} from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-area-con',
  templateUrl: './area-con.component.html',
  styleUrls: ['./area-con.component.css'],
  standalone: false,
})
export class AreaConComponent implements OnInit {
  form!: FormGroup;
  listOfDictrict: DataTableColumn[] = [];
  dictrict: any = [];
  status: 'CREATE' | 'EDIT' = 'CREATE';
  isDictrict = false;
  dictrictId: any = null;
  page = 1;
  pageSize = 5;
  total = 0;
  filter: string = '';
  filteredDictrict: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dictrictService: DictrictLevelService,
    private nzMessage: NzMessageService,
    private nzModalDictrict: NzModalService,
  ) {
    this.form = this.fb.group({
      districtCode: ['', Validators.required], // Mã huyện
      districtName: ['', Validators.required], // Tên huyện
      districtType: ['', Validators.required], // Loại: Quận/Huyện/Thị xã/TP
      provinceId: [null, Validators.required], // Thuộc tỉnh/thành phố nào
      provinceName: [''], // Tên tỉnh/thành phố
      status: [true], // Trạng thái
    });
  }

  ngOnInit() {
    this.initialTabelColumns();
    this.getAllDictrict();
  }

  initialTabelColumns() {
    this.listOfDictrict = [
      {
        title: 'Mã huyện',
        key: 'districtCode',
        width: '150px',
      },
      {
        title: 'Tên huyện',
        key: 'districtName',
        width: '150px',
      },
      {
        title: 'Loại',
        key: 'districtType',
        width: '150px',
      },
      {
        title: 'Thuộc tỉnh/thành phố nào',
        key: 'provinceId',
        width: '150px',
      },
      {
        title: 'Tên tỉnh/thành phố',
        key: 'provinceName',
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
            icon: 'edit',
            key: 'edit',
            type: 'primary',
            callback: (item: any) => this.handleClickDictrictEdit(item),
          },
          {
            icon: 'delete',
            key: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.handleClickDictrictDelete(item),
          },
        ],
      },
    ];
  }

  handleActionClick(event: { action: DataTableAction; row: any }) {
    switch (event.action.key) {
      case 'edit':
        this.handleClickDictrictEdit(event.row);
        break;
      case 'delete':
        this.handleClickDictrictDelete(event.row);
        break;
    }
  }
  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Thêm mới cấp huyện';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật cấp huyện';
    }
    return '';
  }
  openModal() {
    this.status = 'CREATE';
    this.isDictrict = true;
    this.form.reset();
  }

  closeCancel() {
    this.isDictrict = false;
    this.dictrictId = null;
    this.form.reset();
  }

  pageChange(event: any) {
    this.page = event;
    // this.updatePagination();
    this.getAllDictrict();
  }
  pageSizeChange(event: any) {
    this.pageSize = event;
    this.page = 1;
    // this.updatePagination();
    this.getAllDictrict();
  }

  filterSearch() {
    const keywords = this.filter.trim().toLocaleLowerCase();
    this.filteredDictrict = this.dictrict.filter((item: any) => {
      if (!keywords) return true;

      const searchableText = `
      ${item.districtCode ?? ''} 
      ${item.districtName ?? ''} 
      ${item.districtType ?? ''} 
      ${item.provinceName ?? ''}`;
      return searchableText.toLocaleLowerCase().includes(keywords);
    });
    this.page = 1;
    this.getAllDictrict();
  }

  private updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.total = this.filteredDictrict.length;
    this.listOfDictrict = this.filteredDictrict.slice(start, end);
  }
  getAllDictrict() {
    this.dictrictService
      .getAllDictrict(this.page, this.pageSize, this.filter)
      .subscribe({
        next: (res: any) => {
          this.dictrict = res?.data || [];
          // this.listOfDictrict = [...this.dictrict];
          this.total = res?.pagination?.totalPagination ?? 0;
        },
      });
  }

  handleSubmitDictrict() {
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
      this.dictrictService.createDictrict(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới cấp huyện thành công');
          this.getAllDictrict();
        },
      });
    } else {
      this.dictrictService.updateDictrict(this.dictrictId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật cấp huyện thành công', res);
          this.getAllDictrict();
        },
      });
    }
    this.isDictrict = false;
    this.dictrictId = null;
    this.getAllDictrict();
    this.form.reset();
  }

  handleClickDictrictEdit(item: any) {
    this.status = 'EDIT';
    this.dictrictId = item._id ?? item.id;
    this.isDictrict = true;
    this.dictrictService.getDictrictById(this.dictrictId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          districtCode: res?.districtCode,
          districtName: res?.districtName,
          districtType: res?.districtType,
          provinceId: res?.provinceId,
          provinceName: res?.provinceName,
          status: res?.status,
        });
        this.getAllDictrict();
      },
    });
  }

  handleClickDictrictDelete(item: any) {
    this.dictrictId = item._id;
    this.nzModalDictrict.confirm({
      nzTitle: 'Bạn muốn xóa khóa học này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.dictrictService.deleteDictrict(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khóa học thành công', res);
            this.getAllDictrict();
          },
          error: (err: any) => {
            this.nzMessage.error('Xóa khóa học thất bại', err);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
    this.form.reset();
    this.isDictrict = false;
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.dictrictId = item._id ?? item.id;
    this.isDictrict = true;
    this.dictrictService.getDictrictById(this.dictrictId).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
        this.getAllDictrict();
      },
    });
    this.form.reset();
  }

  handleOptionDictrict = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
