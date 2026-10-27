import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

export interface DataTableColumn<T = Record<string, unknown>> {
  title: string;
  key: keyof T | string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  template?: TemplateRef<{ $implicit: T }>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NzTableModule],
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

  get scrollConfig(): { x?: string; y?: string } {
    return {
      ...(this.scrollX ? { x: this.scrollX } : {}),
      ...(this.scrollY ? { y: this.scrollY } : {}),
    };
  }

  valueOf(row: T, key: keyof T | string): unknown {
    return (row as Record<string, unknown>)[String(key)];
  }

  trackByColumn(index: number, column: DataTableColumn<T>): string {
    return `${String(column.key)}-${index}`;
  }

  trachByRow(index: number, row: T): unknown {
    const item = row as Record<string, unknown>;
    return item['id'] ?? item['_id'] ?? index;
  }
}
