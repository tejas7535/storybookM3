import { RecommendationTableData } from '../models';
import { Unitset } from '../models/preferences.model';
import { TableUnitsetPipe } from './table-unitset.pipe';

const MOCK_RECOMMENDATION_DATA: RecommendationTableData = {
  headers: {},
  rows: [
    {
      field: 'testfield',
      minimum: {
        FPS: '1 FUSS',
        SI: '1 METER',
        type: 'convertedDimension',
      },
      recommended: {
        FPS: '2 FUSS',
        SI: '2 METER',
        type: 'convertedDimension',
      },
    },
    {
      field: 'flatfield',
      minimum: 'FLAT',
      recommended: 'TOTALLY FLAT',
    },
  ],
} as const;

describe('TableUnitsetPipe', () => {
  let pipe: TableUnitsetPipe;

  beforeEach(() => {
    pipe = new TableUnitsetPipe();
  });

  describe('Localized objects', () => {
    it('should return the SI value if unit is set as SI', () => {
      const result = pipe.transform(MOCK_RECOMMENDATION_DATA, Unitset.SI);
      expect(result.rows.length).toEqual(2);

      const testfield = result.rows.find(
        (field) => field.field === 'testfield'
      );
      expect(testfield.converted).toBe(false);
      expect(testfield.minimum).toEqual('1 METER');
      expect(testfield.recommended).toEqual('2 METER');
    });

    it('should return the FPS value if unit is set as FPS', () => {
      const result = pipe.transform(MOCK_RECOMMENDATION_DATA, Unitset.FPS);
      expect(result.rows.length).toEqual(2);

      const flatfield = result.rows.find(
        (field) => field.field === 'testfield'
      );
      expect(flatfield.converted).toBe(true);
      expect(flatfield.minimum).toEqual('1 FUSS');
      expect(flatfield.recommended).toEqual('2 FUSS');
    });
  });

  it('flatfield should remain', () => {
    const result = pipe.transform(MOCK_RECOMMENDATION_DATA, Unitset.SI);
    expect(result.rows.length).toEqual(2);
    const flatfield = result.rows.find((field) => field.field === 'flatfield');
    expect(flatfield.minimum).toEqual('FLAT');
    expect(flatfield.recommended).toEqual('TOTALLY FLAT');
  });
});
