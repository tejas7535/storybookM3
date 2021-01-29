import { ValueFormatterParams } from '@ag-grid-community/all-modules';

import { ValidationDescription } from '../../../../core/store/models';
import { infoComparator, materialPipe, transformMaterial } from './column-defs';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('columnDef', () => {
  describe('infoComparator', () => {
    let cell1: any;
    let cell2: any;
    beforeAll(() => {
      cell1 = {
        valid: true,
        description: [ValidationDescription.Valid],
      };
      cell2 = {
        valid: false,
        description: [ValidationDescription.MaterialNumberInValid],
      };
    });

    test('should short info column', () => {
      const res = infoComparator(cell1, cell2);
      expect(res).toEqual(1);
    });
    test('should short info column', () => {
      cell2.valid = true;
      const res = infoComparator(cell1, cell2);
      expect(res).toEqual(0);
    });
    test('should short info column', () => {
      cell1.valid = false;
      cell2.valid = true;
      const res = infoComparator(cell1, cell2);
      expect(res).toEqual(-1);
    });
  });
  describe('transformMaterial', () => {
    test('should call pipe transform', () => {
      materialPipe.transform = jest.fn();
      const data = ({ value: 'any' } as any) as ValueFormatterParams;
      transformMaterial(data);
      expect(materialPipe.transform).toHaveBeenCalledTimes(1);
    });
  });
});
