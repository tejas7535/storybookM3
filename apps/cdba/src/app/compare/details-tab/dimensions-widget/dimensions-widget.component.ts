import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

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
})
export class DimensionsWidgetComponent {
  public constructor(private readonly localeService: TranslocoLocaleService) {}

  @Input()
  public set data(data: DimensionAndWeightDetails) {
    if (!data) {
      this.dimensionData = undefined;
    } else {
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
    }
  }

  public dimensionData: DimensionData;
}
