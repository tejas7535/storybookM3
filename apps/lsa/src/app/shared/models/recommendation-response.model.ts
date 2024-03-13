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
  accessories?: Accessory[];
}

export interface Accessory {
  matNr: string;
  accessoryType: string;
  attributes: { [key: string]: string | number };
}
