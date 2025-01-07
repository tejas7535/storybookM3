import { CalculationParametersEnergySource } from '@ea/core/store/models';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FossilOriginOption {
  label: string;
  value: CalculationParametersEnergySource['fossil']['fossilOrigin'];
}

export interface ElectricityRegionOption {
  label: string;
  value: CalculationParametersEnergySource['electric']['electricityRegion'];
}

export interface CalculationChip {
  text?: string;
  label?: string;
  icon: string;
  newTag?: boolean;
}
