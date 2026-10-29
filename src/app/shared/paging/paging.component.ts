import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-paging',
  standalone: true,
  imports: [FormsModule, NzPaginationModule, NzSelectModule],
  templateUrl: './paging.component.html',
  styleUrl: './paging.component.css',
})
export class PagingComponent {
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 15, 20];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // Danh sách option được tạo sẵn
  get pageSizeOptionsForSelect() {
    return this.pageSizeOptions.map((size) => ({
      label: String(size),
      value: size,
    }));
  }

  changePageSize(pageSize: number): void {
    if (!pageSize || pageSize === this.pageSize) {
      return;
    }

    this.page = 1;
    this.pageSizeChange.emit(pageSize);
  }

  changePage(page: number): void {
    if (page === this.page) {
      return;
    }

    this.pageChange.emit(page);
  }
}
