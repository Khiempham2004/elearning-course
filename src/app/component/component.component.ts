import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css'],
  standalone: false,
})
export class ComponentComponent implements OnInit {
  indexTab: any = 0;
  constructor() {}

  ngOnInit() {}

  handleIndexTab(event: any) {
    this.indexTab = event;
  }
}
