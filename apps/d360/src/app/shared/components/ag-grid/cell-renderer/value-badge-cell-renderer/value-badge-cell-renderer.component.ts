import { Component, signal, WritableSignal } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { NumberWithoutFractionDigitsPipe } from '../../../../pipes/number-without-fraction-digits.pipe';
import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

@Component({
  selector: 'd360-value-badge-cell-renderer',
  imports: [NumberWithoutFractionDigitsPipe],
  templateUrl: './value-badge-cell-renderer.component.html',
  styleUrl: './value-badge-cell-renderer.component.scss',
})
export class ValueBadgeCellRendererComponent extends AbstractBaseCellRendererComponent<
  number | string
> {
  private threshold: number;
  protected showColoredBackground: WritableSignal<boolean> =
    signal<boolean>(false);

  protected setValue(
    parameters: ICellRendererParams<any, number | string> & {
      threshold?: number;
    }
  ): void {
    this.value =
      typeof parameters.value === 'number'
        ? Math.round(parameters.value)
        : Number.parseInt(String(Math.round(Number(parameters.value))), 10);

    this.threshold = parameters.threshold;

    if (this.threshold) {
      this.showColoredBackground.set(this.value >= this.threshold);
    }
  }
}
