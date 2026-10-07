import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictrictLevelService } from '../service/dictrict-level';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    private fb: FormBuilder,
    private dictrictService: DictrictLevelService,
    private nzMessage: NzMessageService,
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
      return 'Chỉnh sửa cấp huyện';
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
    this.getAllDictrict();
  }
  pageSizeChange(event: any) {
    this.pageSize = event;
    this.page = 1;
    this.getAllDictrict();
  }
  getAllDictrict() {
    this.dictrictService.getAllDictrict().subscribe({
      next: (res: any) => {
        this.dictrict = res;
        this.listOfDictrict = [
          ...this.dictrict.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.dictrict.length;
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
    }
  }

  handleClickDictrictEdit(item: any) {
    this.status = 'EDIT';
    this.dictrictId = item.id;
    console.log(item);
  }

  handleClickDictrictDelete(item: any) {
    this.dictrictId = item.id;
  }

  handleOptionDictrict = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
