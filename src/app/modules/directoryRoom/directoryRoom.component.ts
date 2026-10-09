import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from './service/room.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-directoryRoom',
  templateUrl: './directoryRoom.component.html',
  styleUrls: ['./directoryRoom.component.css'],
  standalone: false,
})
export class DirectoryRoomComponent implements OnInit {
  form!: FormGroup;
  direcRoom: any[] = [];
  listOfDirectory: any[] = [];
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
    this.getAllRoom();
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
      this.upPagination();
      return;
    }

    this.filter = this.direcRoom.filter(
      (item: any) =>
        item.roomName?.toLowerCase().includes(keywords) ||
        item.roomCode?.toLowerCase().includes(keywords),
    );
    this.page = 1;
    this.total = this.filter.length;

    this.upPagination();
  }

  getAllRoom() {
    this.roomService.getAllRooms().subscribe({
      next: (res: any) => {
        this.direcRoom = res ?? [];
        this.filter = [...this.direcRoom];
        this.total = this.filter.length;

        this.listOfDirectory = [
          ...this.direcRoom.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
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
    console.log(item);
    this.roomId = item.id;
    this.status = 'EDIT';
    this.isRoom = true;
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
        this.getAllRoom();
      },
    });
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
        this.roomService.deleteRoom(item.id).subscribe({
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
    this.roomId = item.id;
    this.isRoom = true;
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (res: any) => {
        this.form.patchValue(res);
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
