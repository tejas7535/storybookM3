import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  measurementUnitsDefault,
  measurementUnitsOptions,
} from '@ga/shared/constants';
import { MeasurementUnitsOption } from '@ga/shared/models';
import { MeasurementUnitsService } from '@ga/shared/services';

@Component({
  selector: 'ga-measurement-units-select',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, MatSelectModule],
  templateUrl: './measurement-units-select.component.html',
})
export class MeasurementUnitsSelectComponent {
  public measurementUnitsOptions: MeasurementUnitsOption[] =
    measurementUnitsOptions;
  public selectedOption: MeasurementUnitsOption = this.getSelectedOption;

  public constructor(
    private readonly measurementUnitsService: MeasurementUnitsService
  ) {}

  public onMeasurementUnitsSelectChange(option: MeasurementUnitsOption): void {
    this.measurementUnitsService.setMeasurementUnits(option.id);
    location.reload();
  }

  public compareOptions = (
    a: MeasurementUnitsOption,
    b: MeasurementUnitsOption
  ): boolean => a?.id === b?.id;

  protected get getSelectedOption(): MeasurementUnitsOption {
    return (
      this.measurementUnitsOptions.find(
        (option) =>
          option.id === this.measurementUnitsService.getMeasurementUnits()
      ) || this.getDefaultOption
    );
  }

  protected get getDefaultOption(): MeasurementUnitsOption {
    return this.measurementUnitsOptions.find(
      (option) => option.id === measurementUnitsDefault
    );
  }
}
