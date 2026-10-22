import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from './notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.css'],
  standalone: false,
})
export class NotificationManagementComponent implements OnInit {
  form!: FormGroup;
  isNotification = false;
  notificationId: any = null;
  status: 'CREATE' | 'EDIT' = 'CREATE';

  notification: any[] = [];
  listOfNotifi: any[] = [];
  modal: any;
  filter: string = '';
  filterNotifi: any[] = [];

  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private notifiService: NotificationService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      content: [null],
      type: ['SYSTEM'],
      recipient: ['ALL'],
      status: ['DRAFT'],
      createdAt: [Date(), [Validators.required]],
    });
  }

  ngOnInit() {
    this.getAllNotifi();
  }

  get totalNotifi() {
    return this.notification.length;
  }

  get publishedNotification() {
    return this.listOfNotifi.filter((item: any) => {
      return item.status === 'PUBLISHED';
    }).length;
  }
  get modalTitle() {
    if (this.status === 'CREATE') {
      return 'Tạo mới thông báo';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật thông báo';
    }
    return '';
  }
  pageChange(page: any) {
    this.page = page;
    this.getAllNotifi();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllNotifi();
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfNotifi = this.filterNotifi.slice(start, end);
  }

  handleFilter() {
    const keyword = this.filter.trim().toLowerCase();
    if (!keyword) {
      this.filterNotifi = [...this.notification];
      this.total = this.filterNotifi.length;
      this.page = 1;
      // this.updatePagination();
      return;
    }

    this.filterNotifi = this.notification.filter((item: any) => {
      return item.title?.toLowerCase().includes(keyword);
    });
    this.total = this.filterNotifi.length;
    this.page = 1;
    // this.updatePagination();
    this.getAllNotifi();
  }
  onChange(result: Date) {
    console.log('Selected Time: ', result);
  }
  onOk(result: Date | Date[] | null) {
    console.log('onOk:', result);
  }
  openModal() {
    this.isNotification = true;
    this.status = 'CREATE';
    this.form.reset();
  }

  closeModal() {
    this.isNotification = false;
    this.notificationId = null;
    this.form.reset();
  }

  getAllNotifi() {
    this.notifiService
      .getAllNotifi(this.page, this.pageSize, this.filter)
      .subscribe({
        next: (res: any) => {
          this.notification = res?.data;
          this.listOfNotifi = [...this.notification];
          this.total = res?.pagination?.total || 0;
        },
      });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const payload = this.form.getRawValue();
    if (this.status === 'CREATE') {
      this.notifiService.createNotifi(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo mới thành công', res);
          this.getAllNotifi();
        },
        error: (err: any) => {
          this.nzMessage.error('Tạo thông báo bị lỗi');
        },
      });
    } else {
      this.notifiService.putNotifi(this.notificationId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật thành công');
          this.getAllNotifi();
        },
        error: (err: any) => {
          this.nzMessage.error('Cập nhật thông báo lỗi!');
        },
      });
    }
    this.isNotification = false;
    this.notificationId = null;
    this.getAllNotifi();
    this.form.reset();
  }
  editNotifi(item: any) {
    this.status = 'EDIT';
    this.notificationId = item._id ?? item.id;
    this.isNotification = true;
    this.notifiService.getNotifiById(this.notificationId).subscribe({
      next: (res: any) => {
        const notifiData = res?.data;
        if (!notifiData) {
          return;
        }
        if (notifiData) {
          this.form.patchValue({
            title: notifiData.title,
            content: notifiData.content,
            type: notifiData.type,
            recipient: notifiData.recipient,
            status: notifiData.status,
            createdAt: notifiData.createdAt,
          });
        }
      },
      error: (err: any) => {
        console.log('Lỗi không tìm thấy thông báo', err);
      },
    });
    this.getAllNotifi();
  }
  deleteNotifi(item: any) {
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa thông báo này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.notifiService.deleteNotifi(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa thông báo thành công', res);
            this.getAllNotifi();
          },
        });
      },
    });
  }

  optionNotifi = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];
}
