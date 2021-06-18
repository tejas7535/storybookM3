import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UserMenuEntry } from './models/user-menu-entry.model';

@Component({
  selector: 'schaeffler-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  @Input() public user: string;
  @Input() public profileImage: string;
  @Input() public entries: UserMenuEntry[] = [];

  @Output() public readonly clicked: EventEmitter<string> = new EventEmitter();

  /**
   * Emits the clicked event
   */
  public clickItem(key: string): void {
    this.clicked.emit(key);
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
