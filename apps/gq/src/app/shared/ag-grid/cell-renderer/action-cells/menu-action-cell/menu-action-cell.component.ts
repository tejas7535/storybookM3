import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MenuItem } from './model/menu-item.interface';
import { MenuItemCellRendererParams } from './model/menu-item-cell-renderer-params.interface';

@Component({
  selector: 'gq-menu-action-cell',
  templateUrl: './menu-action-cell.component.html',
  styleUrls: ['./menu-action-cell.component.scss'],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuActionCellComponent {
  menuDisabled = false;
  menuItems: MenuItem[] = [];

  public agInit(params: MenuItemCellRendererParams): void {
    this.menuItems = params.menuItems;
    this.menuDisabled = params.menuDisabled;
  }
}
