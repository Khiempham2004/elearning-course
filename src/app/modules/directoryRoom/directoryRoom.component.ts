import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from './service/room.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  DataTableAction,
  DataTableColumn,
} from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-directoryRoom',
  templateUrl: './directoryRoom.component.html',
  styleUrls: ['./directoryRoom.component.css'],
  standalone: false,
})
export class DirectoryRoomComponent implements OnInit {
  form!: FormGroup;
  direcRoom: any[] = [];
  listOfDirectory: DataTableColumn[] = [];
  filterSearch: string = '';

  filter: any[] = [];

  status: 'CREATE' | 'EDIT' = 'CREATE';
  isRoom = false;
  roomId: any = null;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private nzMessage: NzMessageService,
    private nzModal: NzModalService,
  ) {
    this.form = this.fb.group({
      roomCode: ['', Validators.required],
      roomName: ['', Validators.required],
      roomType: ['', Validators.required],
      status: ['true'],
    });
  }

  ngOnInit() {
    this.initialTableColumn();
    this.getAllRoom();
  }

  initialTableColumn() {
    this.listOfDirectory = [
      {
        title: 'Mã phòng',
        key: 'roomCode',
        width: '150px',
      },
      {
        title: 'Tên phòng',
        key: 'roomName',
        width: '150px',
      },
      {
        title: 'Loại phòng',
        key: 'roomType',
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
            callback: (item: any) => this.handleEditRoom(item),
          },
          {
            icon: 'delete',
            key: 'delete',
            type: 'primary',
            danger: true,
            callback: (item: any) => this.handleDeleteRoom(item),
          },
        ],
      },
    ];
  }

  handleActionClick(event: { action: DataTableAction; row: any }) {
    switch (event.action.key) {
      case 'edit':
        this.handleEditRoom(event.row);
        break;
      case 'delete':
        this.handleDeleteRoom(event.row);
        break;
    }
  }
  pageChange(page: any) {
    this.page = page;
    this.getAllRoom();
  }

  pageSizeChange(pagesize: any) {
    this.pageSize = pagesize;
    this.page = 1;
    this.getAllRoom();
  }
  get modalTitleRoom() {
    if (this.status === 'CREATE') {
      return 'Tạo mới phòng';
    }
    if (this.status === 'EDIT') {
      return 'Cập nhật phòng';
    }
    return '';
  }
  openModal() {
    this.isRoom = true;
    this.status = 'CREATE';
    this.form.reset();
  }
  closeCancel() {
    this.isRoom = false;
    this.roomId = null;
    this.form.reset();
  }

  upPagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfDirectory = this.filter.slice(start, end);
  }

  handleFilter() {
    const keywords = this.filterSearch.trim().toLowerCase();
    if (!keywords) {
      this.filter = [...this.direcRoom];
      this.page = 1;
      this.total = this.filter.length;
      this.getAllRoom();
      return;
    }

    this.filter = this.direcRoom.filter(
      (item: any) =>
        item.roomName?.toLowerCase().includes(keywords) ||
        item.roomCode?.toLowerCase().includes(keywords),
    );
    this.page = 1;
    this.total = this.filter.length;
    this.getAllRoom();
  }

  getAllRoom() {
    this.roomService
      .getAllRooms(this.page, this.pageSize, this.filterSearch)
      .subscribe({
        next: (res: any) => {
          this.direcRoom = res?.data || [];
          // this.listOfDirectory = [...this.direcRoom];
          this.total = res?.pagination?.total || 0;
        },
      });
  }

  handleSubmitRoom() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.form.invalid;
        }
      });
      return;
    }

    const payload = this.form.getRawValue();
    if (this.status === 'CREATE') {
      this.roomService.createRoom(payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Tạo danh sách phòng thành công', res);
          this.page = 1;
          this.getAllRoom();
        },
      });
    } else {
      this.roomService.updateRoom(this.roomId, payload).subscribe({
        next: (res: any) => {
          this.nzMessage.success('Cập nhật danh sách phòng thành công');
          this.getAllRoom();
        },
      });
    }
    this.isRoom = false;
    this.roomId = null;
    this.getAllRoom();
    this.form.reset();
  }
  handleEditRoom(item: any) {
    this.roomId = item._id ?? item.id;
    this.status = 'EDIT';
    this.isRoom = true;
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (res: any) => {
        const roomData = res?.data;

        if (!roomData) {
          return;
        }
        if (roomData) {
          this.form.patchValue({
            roomCode: roomData?.roomCode,
            roomName: roomData?.roomName,
            roomType: roomData?.roomType,
            status: roomData?.status,
          });
        }
      },
      error: (err: any) => {
        this.nzMessage.error('Lấy danh sách phòng lỗi', err);
      },
    });
    this.getAllRoom();
  }
  handleDeleteRoom(item: any) {
    console.log(item);
    this.page = 1;
    this.nzModal.confirm({
      nzTitle: 'Bạn có muốn xóa cấp tỉnh này không?',
      nzContent: '',
      nzOkText: 'yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.roomService.deleteRoom(item._id).subscribe({
          next: (res: any) => {
            this.nzMessage.success('Xóa khoá học thành công', res);
            this.getAllRoom();
          },
        });
      },
    });
  }

  handleRowClick(item: any) {
    this.status = 'EDIT';
    this.roomId = item._id ?? item.id;
    this.isRoom = true;
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (res: any) => {
        const roomData = res?.data || [];
        this.form.patchValue(roomData);
        this.getAllRoom();
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
