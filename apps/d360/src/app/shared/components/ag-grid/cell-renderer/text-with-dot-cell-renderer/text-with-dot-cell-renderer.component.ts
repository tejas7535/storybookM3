import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

export type TextWithDotParams<T> = ICellRendererParams<any, T> & {
  showSyncIcon?: (params: TextWithDotParams<T>) => boolean;
  syncIconTooltip?: string;
};

/**
 * This is a custom cell renderer to render the text-with-dot cells.
 *
 * @export
 * @class TextWithDotCellRendererComponent
 * @extends {AbstractBaseCellRendererComponent<T>}
 * @template T
 */
@Component({
  selector: 'd360-text-with-dot-cell-renderer',
  imports: [MatTooltip, MatIcon],
  templateUrl: './text-with-dot-cell-renderer.component.html',
  styleUrl: './text-with-dot-cell-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextWithDotCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  protected parameters!: TextWithDotParams<T>;
  protected isGroup!: boolean;
  protected syncIconTooltip!: string;
  protected expanded: WritableSignal<boolean> = signal(false);

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(parameters: TextWithDotParams<T>): void {
    this.parameters = parameters;

    this.isGroup = !!parameters.node.group;
    this.syncIconTooltip = parameters?.syncIconTooltip ?? '';
    this.expanded.set(this.parameters.node.expanded);

    this.parameters.node.addEventListener('expandedChanged', this.onExpand);
  }

  public onClick() {
    this.expanded.set(!this.parameters.node.expanded);
    this.parameters.node.setExpanded(!this.parameters.node.expanded);
  }

  public destroy() {
    this.parameters.node.removeEventListener('expandedChanged', this.onExpand);
  }

  private readonly onExpand = () => {
    this.expanded.set(this.parameters.node.expanded);
  };
}
