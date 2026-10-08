import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictrictLevelService } from '../service/dictrict-level';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-area-con',
  templateUrl: './area-con.component.html',
  styleUrls: ['./area-con.component.css'],
  standalone: false,
})
export class AreaConComponent implements OnInit {
  form!: FormGroup;
  listOfDictrict: any = [];
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
    this.getAllDictrict();
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
    this.updatePagination();
  }
  pageSizeChange(event: any) {
    this.pageSize = event;
    this.page = 1;
    this.updatePagination();
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
    this.updatePagination();
  }

  private updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    this.total = this.filteredDictrict.length;
    this.listOfDictrict = this.filteredDictrict.slice(
      start,
      start + this.pageSize,
    );
  }
  getAllDictrict() {
    this.dictrictService.getAllDictrict().subscribe({
      next: (res: any) => {
        this.dictrict = Array.isArray(res) ? res : [];
        this.filterSearch();
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
          this.nzMessage.success('Cập nhật cấp huyện thành công');
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
    this.dictrictId = item.id;
    this.isDictrict = true;
    this.dictrictService.getDictrictById(item.id).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
        this.getAllDictrict();
      },
    });
    console.log(item);
  }

  handleClickDictrictDelete(item: any) {
    this.dictrictId = item.id;
    this.nzModalDictrict.confirm({
      nzTitle: 'Bạn muốn xóa khóa học này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.dictrictService.deleteDictrict(item.id).subscribe({
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
    this.isDictrict = true;
    this.dictrictService.getDictrictById(item.id).subscribe({
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
