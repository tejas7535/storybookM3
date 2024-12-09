import { Medium } from '@lsa/shared/constants';
import { RecommendationResponse } from '@lsa/shared/models';

export const mockResponse: RecommendationResponse = {
  timestamp: 0,
  lubricators: {
    minimumRequiredLubricator: {
      matNr: '0951660500000',
      name: 'ARCALUB-C1-60-REFILLABLE',
      outputDiameter: 5,
      maxOperatingPressure: 5,
      noOfOutlets: 1,
      maxTemp: 55,
      minTemp: -20,
      batteryPowered: true,
      medium: Medium.Grease,
      description:
        'CONCEPT1, Single-point lubrication, gas-driven, without lubricant',
      productSeries: 'C1',
      volume: '60',
      isOptime: 0,
      productImageUrl:
        'https://cdn.schaeffler-ecommerce.com/cdn/00171550_d.png',
      technicalAttributes: {
        funcPrinciple: 'gas powered',
      },
    },
    recommendedLubricator: {
      matNr: '0951660500001',
      name: 'ARCALUB-C2-60-REFILLABLE',
      outputDiameter: 4,
      maxOperatingPressure: 4,
      noOfOutlets: 2,
      maxTemp: 60,
      minTemp: -25,
      batteryPowered: false,
      medium: Medium.Oil,
      description:
        'CONCEPT2, Single-point lubrication, gas-driven, without lubricant',
      productSeries: 'C2',
      volume: '600',
      isOptime: 1,
      productImageUrl:
        'https://cdn.schaeffler-ecommerce.com/cdn/00171550_d.png',
      technicalAttributes: {
        funcPrinciple: 'gas powered',
      },
    },
  },
  classes: [
    { class: '12345', title: 'Sample Class 1' },
    { class: '67890', title: 'Sample Class 2' },
  ],
  input: {
    battery: 2,
    greaseId: 'ARCALUB_MULTI2',
    lubricationInterval: 'year',
    lubricationPoints: '1',
    lubricationQty: 60,
    maxTemp: 20,
    minTemp: 5,
    medium: 'Grease',
    optime: 2,
    pipeLength: 0,
  },
};
