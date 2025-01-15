import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
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
  submenu?: MenuItem[];
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
  imports: [
    MatTooltipModule,
    MatIconButton,
    MatIcon,
    MatMenuModule,
    MatDivider,
  ],
  templateUrl: './actions-menu-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './actions-menu-cell-renderer.component.scss',
})
export class ActionsMenuCellRendererComponent<
  T = {
    getMenu: () => MenuItem[];
    isDisabled?: () => boolean;
  },
> extends AbstractBaseCellRendererComponent<T> {
  /**
   * @inheritdoc
   */
  public value: MenuItem[] = [];

  /**
   * Indicated, if the menu is enabled/disabled
   *
   * @protected
   * @type {Signal<boolean>}
   * @memberof ActionsMenuCellRendererComponent
   */
  protected isDisabled: WritableSignal<boolean> = signal(false);

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(): void {
    if (!!this.parameters?.context && 'getMenu' in this.parameters.context) {
      this.value = this.parameters.context['getMenu'](this.parameters) || [];
    }

    if (!!this.parameters?.context && 'isDisabled' in this.parameters.context) {
      this.isDisabled.set(this.parameters.context.isDisabled());
    }
  }
}
