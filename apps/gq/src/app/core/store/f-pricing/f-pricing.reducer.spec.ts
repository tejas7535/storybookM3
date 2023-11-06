import {
  MATERIAL_INFORMATION_EXTENDED_MOCK,
  MATERIAL_INFORMATION_MOCK,
} from '../../../../testing/mocks/models/fpricing/material-information.mock';
import {
  fPricingFeature,
  getDeltaByInformationKeyAndPropertyKey,
  getNumberOfDeltasByInformationKey,
} from './f-pricing.reducer';
import { PropertyDelta } from './models/property-delta.interface';

describe('fPricingReducer', () => {
  describe('getMaterialInformation', () => {
    test('should return the base material information and calculate data for the deltas', () => {
      const result = fPricingFeature.getMaterialInformationExtended.projector(
        MATERIAL_INFORMATION_MOCK
      );

      expect(result).toEqual(MATERIAL_INFORMATION_EXTENDED_MOCK);
    });
  });

  describe('getNumberOfDeltasByInformationKey', () => {
    test("should return 2 for 'innerRing'", () => {
      const numberOfDeltas = getNumberOfDeltasByInformationKey(
        'innerRing',
        MATERIAL_INFORMATION_MOCK
      );

      expect(numberOfDeltas).toBe(2);
    });
    test('should return 0 for unknown key', () => {
      const numberOfDeltas = getNumberOfDeltasByInformationKey(
        'unknown',
        MATERIAL_INFORMATION_MOCK
      );

      expect(numberOfDeltas).toBe(0);
    });
  });
  describe('getDeltaByInformationKeyAndPropertyKey', () => {
    test("should return numeric delta for 'innerRing' and 'raceawayDiameter'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[0],
        'raceawayDiameter'
      );

      const expected: PropertyDelta = {
        isDelta: true,
        absolute: 30,
        relative: 33,
      };
      expect(delta).toEqual(expected);
    });

    test("should return numeric isDelta false for 'innerRing' and 'materialCat'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[0],
        'materialCat'
      );

      const expected: PropertyDelta = {
        isDelta: false,
      };
      expect(delta).toEqual(expected);
    });

    test("should return isDelta true for 'outerRing' and 'cageMaterial'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[1],
        'cageMaterial'
      );

      const expected: PropertyDelta = {
        isDelta: true,
      };
      expect(delta).toEqual(expected);
    });
  });
});
