import { FillDiameterParams } from '../../../shared/models';
import { fillDiameterConditionally, fillDiameters } from './filler-helpers';

describe('fillDiameterConditionally', () => {
  it('should spread in a dimension if the respective other one exists', () => {
    const mockParams = {
      pattern: '',
      bearingType: 'IDO_RADIAL_ROLLER_BEARING',
      minDi: undefined as any,
      maxDi: undefined as any,
      minDa: undefined as any,
      maxDa: undefined as any,
      minB: undefined as any,
      maxB: undefined as any,
    };

    const mockFillDiameterParams: FillDiameterParams = {
      parameters: mockParams,
      key: 'minDi',
      // eslint-disable-next-line unicorn/no-null
      potentiallyEmpty: null,
      reference: 10,
    };

    const result = fillDiameterConditionally(mockFillDiameterParams);

    expect(result).toEqual({ ...mockParams, minDi: 10 });
  });
});

describe('fillDiameters', () => {
  it('call the fillDiameterConditionally six times differently', () => {
    const mockParams = {
      pattern: '',
      bearingType: 'IDO_RADIAL_ROLLER_BEARING',
      minDi: 15 as any,
      maxDi: undefined as any,
      minDa: 10 as any,
      maxDa: undefined as any,
      minB: 30 as any,
      maxB: undefined as any,
    };
    const expectedResult = {
      pattern: '',
      bearingType: 'IDO_RADIAL_ROLLER_BEARING',
      minDi: 15 as any,
      maxDi: 15 as any,
      minDa: 10 as any,
      maxDa: 10 as any,
      minB: 30 as any,
      maxB: 30 as any,
    };

    const result = fillDiameters(mockParams);

    expect(result).toStrictEqual(expectedResult);
  });
});
