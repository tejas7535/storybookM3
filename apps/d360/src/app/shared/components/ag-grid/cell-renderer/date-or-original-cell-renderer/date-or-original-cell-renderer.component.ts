import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { parseDateIfPossible } from '../../../../utils/parse-values';
import { ValidationHelper } from '../../../../utils/validation/validation-helper';
import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

/**
 * This is a custom cell renderer to render the edit date cells.
 *
 * @export
 * @class DateOrOriginalCellRenderer
 * @extends {AbstractBaseCellRendererComponent<T>}
 * @template T
 */
@Component({
  selector: 'd360-date-or-original-cell-renderer',
  imports: [],
  template: `
    @if (value) {
      {{ getValue() }}
    } @else {
      <span class="text-low-emphasis">{{ getDateFormat() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateOrOriginalCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  protected setValue(parameters: ICellRendererParams<any, T>): void {
    this.value = parameters.value;
  }

  protected getValue(): string {
    return parseDateIfPossible(this.value);
  }

  protected getDateFormat(): string {
    return ValidationHelper.getDateFormat().toLocaleLowerCase();
  }
}
