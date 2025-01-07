import { Injectable } from '@angular/core';

import { CalculationParametersEnergySource } from '@ea/core/store/models';
import { TranslocoService } from '@jsverse/transloco';

import { DownstreamOperatingConditions } from '../downstream-calculation.service.interface';
import {
  CalculationChip,
  ElectricityRegionOption,
  FossilOriginOption,
  SelectOption,
} from './calculation-parameters-form.interface';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersChipsService {
  constructor(private readonly translocoService: TranslocoService) {}

  public getContaminationChip(
    contaminationOptions: SelectOption[],
    contamination: string
  ): CalculationChip {
    return {
      text: contaminationOptions.find((opt) => opt.value === contamination)
        ?.label,
      label: this.translocoService.translate(
        'operationConditions.contamination.title'
      ),
      icon: 'mop',
    };
  }

  public getEnergySourceChip(
    type: CalculationParametersEnergySource['type'],
    fossilOrigin:
      | DownstreamOperatingConditions['fossilEmissionFactor']
      | undefined,
    electricityRegion:
      | DownstreamOperatingConditions['electricEmissionFactor']
      | undefined,
    fossilOptions: FossilOriginOption[],
    electricityRegionOptions: ElectricityRegionOption[]
  ): CalculationChip {
    return {
      text: this.getEnergySouceChipTextValue(
        type,
        fossilOrigin,
        electricityRegion,
        fossilOptions,
        electricityRegionOptions
      ),
      label: this.translocoService.translate(
        'operationConditions.energySource.title'
      ),
      icon: 'bolt',
      newTag: true,
    };
  }

  public getTimeChip(numberOfHours: number): CalculationChip {
    return {
      text: `${numberOfHours}\u00A0h`,
      label: this.translocoService.translate('operationConditions.time.title'),
      icon: 'acute',
      newTag: true,
    };
  }

  private getEnergySouceChipTextValue(
    type: CalculationParametersEnergySource['type'],
    fossilOrigin:
      | DownstreamOperatingConditions['fossilEmissionFactor']
      | undefined,
    electricityRegion:
      | DownstreamOperatingConditions['electricEmissionFactor']
      | undefined,
    fossilOptions: FossilOriginOption[],
    electricityRegionOptions: ElectricityRegionOption[]
  ): string {
    if (type === 'fossil') {
      const fossilOriginOption = fossilOptions.find(
        (option) => option.value === fossilOrigin
      );

      return fossilOriginOption?.label ?? '';
    }

    const electricityRegionOption = electricityRegionOptions.find(
      (option) => option.value === electricityRegion
    );

    return this.translocoService.translate(
      'operationConditions.energySource.electricityChipText',
      { region: this.getElectricityLabelText(electricityRegionOption) }
    );
  }

  private getElectricityLabelText(
    electricityRegionOption: ElectricityRegionOption | undefined
  ): string {
    if (!electricityRegionOption) {
      return '';
    }

    return electricityRegionOption.value === 'LB_EUROPEAN_UNION'
      ? 'EU'
      : electricityRegionOption.label;
  }
}
