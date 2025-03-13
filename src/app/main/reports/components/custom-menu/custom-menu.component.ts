import { Component, Input, EventEmitter, Output } from '@angular/core';

interface MenuItem {
  name: string;
  selector: string;
}

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss'],
})
export class CustomMenuComponent {
  @Input() subject = '';
  @Input() selectedItem;
  @Input() menuList: MenuItem[] = [];
  @Output() onChange: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  onChangeItem(item) {
    this.onChange.emit(item);
  }
}
