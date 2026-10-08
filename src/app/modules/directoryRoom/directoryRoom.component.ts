import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from './service/room.service';

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

  status: 'CREATE' | 'EDIT' = 'CREATE';
  isRoom = false;
  roomId: any = null;
  page = 1;
  pageSize = 5;
  total = 0;
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
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

  getAllRoom() {
    this.roomService.getAllRooms().subscribe({
      next: (res: any) => {
        this.direcRoom = res ?? [];
        this.listOfDirectory = [
          ...this.direcRoom.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize,
          ),
        ];
        this.total = this.direcRoom.length;
      },
    });
  }

  handleSubmitRoom() {}
  handleEditRoom(item: any) {
    console.log(item);
  }
  handleDeleteRoom(item: any) {
    console.log(item);
  }
}
