import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { DimensionAndWeightDetails } from '@cdba/shared/models';

interface DimensionData {
  width: string;
  height: string;
  length: string;
  weight: string;
  volume: string;
}

@Component({
  selector: 'cdba-dimensions-widget',
  templateUrl: './dimensions-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DimensionsWidgetComponent {
  public dimensionData: DimensionData;

  public constructor(private readonly localeService: TranslocoLocaleService) {}

  @Input()
  public set data(data: DimensionAndWeightDetails) {
    if (data) {
      const height = data.height
        ? `${this.localeService.localizeNumber(data.height, 'decimal')} ${
            data.unitOfDimension || ''
          }`
        : undefined;

      const width = data.width
        ? `${this.localeService.localizeNumber(data.width, 'decimal')} ${
            data.unitOfDimension || ''
          }`
        : undefined;

      // eslint-disable-next-line unicorn/explicit-length-check
      const length = data.length
        ? `${this.localeService.localizeNumber(data.length, 'decimal')} ${
            data.unitOfDimension || ''
          }`
        : undefined;

      const weight = data.weight
        ? `${this.localeService.localizeNumber(data.weight, 'decimal')} ${
            data.weightUnit || ''
          }`
        : undefined;

      const volume = data.volumeCubic
        ? `${this.localeService.localizeNumber(data.volumeCubic, 'decimal')} ${
            data.volumeUnit || ''
          }`
        : undefined;

      this.dimensionData = {
        height,
        width,
        length,
        weight,
        volume,
      };
    } else {
      this.dimensionData = undefined;
    }
  }
}
