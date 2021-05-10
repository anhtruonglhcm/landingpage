import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  IMenuLeft,
  MenuChildAddNew,
  MenuLeft,
} from 'src/app/constant/left-menu.constant';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  public menuLeft: IMenuLeft[];
  @Output() addElement = new EventEmitter<MenuChildAddNew>();
  constructor() {}

  ngOnInit(): void {
    this.menuLeft = MenuLeft;
  }
  clickItem(index: number, event) {
    this.menuLeft[index].isSelected = !this.menuLeft[index].isSelected;
  }
  clickChild(dataKey: MenuChildAddNew) {
    this.addElement.emit(dataKey);
  }
}
