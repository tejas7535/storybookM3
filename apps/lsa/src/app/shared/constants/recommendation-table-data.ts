import { Lubricator } from '../models';

export const recommendationTableFields: (keyof Lubricator)[] = [
  'maxOperatingPressure',
  'volume',
  'outputDiameter',
  'noOfOutlets',
  'maxTemp',
  'minTemp',
  'batteryPowered',
  'medium',
  'isOptime',
];
