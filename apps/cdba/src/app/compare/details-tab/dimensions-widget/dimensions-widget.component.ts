import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';

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
  styleUrls: ['./dimensions-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DimensionsWidgetComponent {
  public constructor(private readonly decimalPipe: DecimalPipe) {}

  @Input()
  public set data(data: DimensionAndWeightDetails) {
    if (!data) {
      this.dimensionData = undefined;
    } else {
      const height = data.height
        ? `${this.decimalPipe.transform(data.height)} ${data.unitOfDimension}`
        : undefined;

      const width = data.width
        ? `${this.decimalPipe.transform(data.width)} ${data.unitOfDimension}`
        : undefined;

      // eslint-disable-next-line unicorn/explicit-length-check
      const length = data.length
        ? `${this.decimalPipe.transform(data.length)} ${data.unitOfDimension}`
        : undefined;

      const weight = data.weight
        ? `${this.decimalPipe.transform(data.weight)} ${data.weightUnit}`
        : undefined;

      const volume = data.volumeCubic
        ? `${this.decimalPipe.transform(data.volumeCubic)} ${data.volumeUnit}`
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
