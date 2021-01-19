export enum InputSideTypes {
  from = 'FROM',
  to = 'TO',
}

export interface HardnessUnitsResponse {
  units: string[];
}

export interface HardnessConversionResponse {
  converted: number;
  error?: string;
}

export interface HardnessConversionResponseWithSide
  extends HardnessConversionResponse {
  side: InputSideTypes;
}
