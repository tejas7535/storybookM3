export interface MMSelectOption<T> {
  label: string;
  value: T;
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

export interface ThermalCalculationOptionsFormData {
  toleranceClass?: string;
  upperDeviation?: number;
  lowerDeviation?: number;
  temperature: number;
}
