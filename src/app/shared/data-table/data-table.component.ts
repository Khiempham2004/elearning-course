import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

export interface DataTableAction<T = Record<string, unknown>> {
  visible?: boolean | ((item: any) => boolean);
  show?: (item: any) => boolean;
  key: string;
  label?: string;
  icon?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  danger?: boolean;
  disabled?: (row: T) => boolean;
  callback?: (item: any) => void;
}

export interface DataTableColumn<T = Record<string, unknown>> {
  title: string;
  key: keyof T | string;
  width?: string;
  height?: string;
  align?: 'left' | 'center' | 'right';
  template?: TemplateRef<{ $implicit: T }>;
  actions?: DataTableAction<T>[];
  dateFormat?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T = Record<string, unknown>> {
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() bordered = true;
  @Input() scrollX?: string;
  @Input() scrollY?: string;
  @Input() tableClass = '';
  @Input() showCheckbox: boolean = false;
  @Input() showSelection = false;
  @Input() loading = false;
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();

  onActionClick(action: DataTableAction<T>, row: T, event: MouseEvent): void {
    event.stopPropagation();
    action.callback?.(row);
    this.actionClick.emit({ action: action.key, row });
  }

  get scrollConfig(): { x?: string; y?: string } {
    return {
      ...(this.scrollX ? { x: this.scrollX } : {}),
      ...(this.scrollY ? { y: this.scrollY } : {}),
    };
  }

  valueOf(row: T, key: keyof T | string, column: DataTableColumn<T>): unknown {
    const value = (row as Record<string, unknown>)[String(key)];
    if (typeof value === 'boolean') {
      return String(value);
    }

    if (column.dateFormat && typeof value === 'string') {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [ , year, month, day] = match;
        if (column.dateFormat === 'dd/MM/yyyy') {
          return `${day}/${month}/${year}`;
        }
      }
    }
    // Render boolean values explicitly so false is displayed as text in tables.
    return value;
  }

  onRowClick(event: any, column: DataTableColumn<T>) {
    if (column && column.key !== this.columns[0]?.key) {
      return;
    }
    this.rowClick.emit(event);
  }
  // trackByColumn(index: number, column: DataTableColumn<T>): string {
  //   return `${String(column.key)}-${index}`;
  // }

  // trachByRow(index: number, row: T): unknown {
  //   const item = row as Record<string, unknown>;
  //   return item['id'] ?? item['_id'] ?? index;
  // }
}
