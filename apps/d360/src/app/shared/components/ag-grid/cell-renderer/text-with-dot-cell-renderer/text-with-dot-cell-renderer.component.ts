import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

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
  standalone: true,
  imports: [],
  template: `
    <div class="dot {{ parameters?.data?.color?.(value) }}"></div>
    <div class="title {{ parameters?.data?.titleStyle?.(value) }}">
      {{ parameters?.value }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './text-with-dot-cell-renderer.component.scss',
})
export class TextWithDotCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    parameters: ICellRendererParams<any, T> & {
      materialClassification?: string;
    }
  ): void {
    this.value = null;
    this.parameters = parameters;

    if ('materialClassification' in this.parameters) {
      this.value = this.parameters.materialClassification;
    }
  }
}
