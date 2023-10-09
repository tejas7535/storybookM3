import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Tab } from './tab.model';

@Component({
  selector: 'gq-tabs-header',
  templateUrl: './tabs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsHeaderComponent {
  @Input() tabs: Tab[];
  @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;

  public contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  public showContextMenu(event: MouseEvent, tab: Tab): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX;
    this.contextMenuPosition.y = event.clientY;
    this.contextMenu.menuData = { tab };

    this.contextMenu.openMenu();
  }

  public getUrl(tab: Tab): string {
    return `${window.location.origin}/${tab?.parentPath}/${tab?.link}${window.location.search}`;
  }
}
