import {
  MountingOptionType,
  PreviousMountingNumberOptionType,
  ShaftMaterialType,
} from '@mm/shared/constants/calculation-options';

export interface HyndraulicNutTypeOption {
  label: string;
  value: string;
}

export interface PreviousMountingOption {
  label: string;
  value: PreviousMountingNumberOptionType;
}

export interface MountingSelectOption {
  label: string;
  value: MountingOptionType;
}

export interface ShaftMaterialOption {
  label: string;
  value: ShaftMaterialType;
}

export interface CalculationOptionsFormData {
  hydraulicNutType: string;
  previousMountingOption: string;
  mountingOption: string;
  innerRingExpansion?: string;
  radialClearanceReduction?: string;
  shaftDiameter: string;
  shaftMaterial: string;
}
