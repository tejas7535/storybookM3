import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { ProcessCaseFacade } from '@gq/core/store/process-case/process-case.facade';
import { ContextMenuModule } from '@gq/shared/components/contextMenu/context-menu.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Tab } from './tab.model';

@Component({
  selector: 'gq-tabs-header',
  templateUrl: './tabs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTabsModule,
    SharedTranslocoModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule,
  ],
})
export class TabsHeaderComponent {
  @Input() tabs: Tab[];
  @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;

  private readonly processCaseFacade = inject(ProcessCaseFacade);

  readonly tableIsFullscreen = this.processCaseFacade.tableIsFullscreen;

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
