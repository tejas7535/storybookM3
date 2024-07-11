import { Medium } from '../constants';

export interface RecommendationResponse {
  timestamp: number;
  lubricators: {
    recommendedLubricator: Lubricator;
    minimumRequiredLubricator: Lubricator;
  };
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
  designation: string;
  product_image: string;
  class: string | number;
  price?: number;
  attributes: { [key: string]: string | number };
}
