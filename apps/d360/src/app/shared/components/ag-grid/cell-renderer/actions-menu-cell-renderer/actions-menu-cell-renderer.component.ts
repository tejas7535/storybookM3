import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

/**
 * The Menu Item Interface
 *
 * @export
 * @interface MenuItem
 */
export interface MenuItem {
  onClick: () => void;
  text: string;
  icon?: string;
}

/**
 * This is a custom cell renderer to render the action dropdown menu.
 *
 * @export
 * @class ActionsMenuCellRendererComponent
 * @extends {AbstractBaseCellRendererComponent<T>}
 * @template T
 */
@Component({
  selector: 'd360-actions-menu-cell-renderer',
  standalone: true,
  imports: [MatTooltipModule, MatIconButton, MatIcon, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon class="text-icon-link">more_vert</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      @for (item of value; track item) {
        <button mat-menu-item (click)="item.onClick()">
          {{ item.text }}
        </button>
      }
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './actions-menu-cell-renderer.component.scss',
})
export class ActionsMenuCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  /**
   * @inheritdoc
   */
  public value: MenuItem[] = [];

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(): void {
    if (!!this.parameters?.context && 'getMenu' in this.parameters.context) {
      this.value = this.parameters.context['getMenu'](this.parameters) || [];
    }
  }
}
