import { Medium } from '../constants';
import { RecommendationRequest } from './recommendation-request.model';

export interface RecommendationResponse {
  timestamp: number;
  lubricators: {
    recommendedLubricator: Lubricator;
    minimumRequiredLubricator: Lubricator;
  };
  classes: AccessoryClassEntry[];
  notices?: CalculationInfo[];
  warnings?: CalculationInfo[];
  input: RecommendationRequest;
}

export class ErrorResponse extends Error {
  message: string;
}
export interface CalculationInfo {
  titleId: string;
  description: string;
}

export interface Lubricator {
  matNr: string;
  name: string;
  outputDiameter: number;
  maxOperatingPressure: number;
  noOfOutlets: number;
  maxTemp: number;
  minTemp: number;
  batteryPowered: boolean;
  medium: Medium;
  description: string;
  productSeries: string;
  volume: string;
  isOptime: 0 | 1;
  productImageUrl: string;
  bundle?: Accessory[];
  technicalAttributes: { [key: string]: string };
}

export interface Accessory {
  matnr: string;
  qty: number;
  description: string;
  fifteen_digit: string;
  pim_code: string;
  designation: string;
  product_image: string;
  class: string | number;
  class_id: string;
  price?: number;
  currency?: string;
  availability?: boolean;
  attributes: { [key: string]: string | number };
}

export interface AccessoryClassEntry {
  class: string;
  priority?: number;
  title: string;
}
