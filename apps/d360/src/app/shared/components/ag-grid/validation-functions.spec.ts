/* eslint-disable @typescript-eslint/ban-types */
import { errorColorLight } from '../../styles/colors';
import { GridTooltipComponent } from './grid-tooltip/grid-tooltip.component';
import {
  buildValidationProps,
  getColumIdFromColumnDef,
  rowIsEmpty,
} from './validation-functions';

describe('Validation Functions', () => {
  describe('buildValidationProps', () => {
    const mockValidationFn = jest.fn();
    const mockNode = { data: { field1: 'value1' } } as any;
    const mockParams = {
      value: 'testValue',
      node: mockNode,
      colDef: { field: 'testField' } as any,
    };

    beforeEach(() => {
      mockValidationFn.mockClear();
    });

    it('should return correct validation props', () => {
      const result = buildValidationProps(mockValidationFn);

      expect(result).toEqual({
        tooltipComponent: GridTooltipComponent,
        tooltipValueGetter: expect.any(Function),
        tooltipComponentParams: { lineBreaks: true },
        cellStyle: expect.any(Function),
      });
    });

    it('should call validation function with correct parameters in tooltipValueGetter', () => {
      mockValidationFn.mockReturnValue('Error message');
      const result = buildValidationProps(mockValidationFn);

      const tooltipValueGetter = result?.tooltipValueGetter as Function;
      const tooltipResult = tooltipValueGetter(mockParams);

      expect(mockValidationFn).toHaveBeenCalledWith(
        'testValue',
        mockNode,
        'testField'
      );
      expect(tooltipResult).toBe('Error message');
    });

    it('should return undefined for tooltipValueGetter when node is missing', () => {
      const result = buildValidationProps(mockValidationFn);
      const tooltipValueGetter = result?.tooltipValueGetter as Function;

      const tooltipResult = tooltipValueGetter({
        ...mockParams,
        node: undefined,
      });

      expect(tooltipResult).toBeUndefined();
      expect(mockValidationFn).not.toHaveBeenCalled();
    });

    it('should return undefined for tooltipValueGetter when value is empty and validateEmptyValues is false', () => {
      const result = buildValidationProps(mockValidationFn);
      const tooltipValueGetter = result?.tooltipValueGetter as Function;

      const tooltipResult = tooltipValueGetter({ ...mockParams, value: '' });

      expect(tooltipResult).toBeUndefined();
      expect(mockValidationFn).not.toHaveBeenCalled();
    });

    it('should call validation function for empty values when validateEmptyValues is true', () => {
      mockValidationFn.mockReturnValue('Error on empty');
      const result = buildValidationProps(mockValidationFn, true);
      const tooltipValueGetter = result?.tooltipValueGetter as Function;

      const tooltipResult = tooltipValueGetter({ ...mockParams, value: '' });

      expect(mockValidationFn).toHaveBeenCalledWith('', mockNode, 'testField');
      expect(tooltipResult).toBe('Error on empty');
    });

    it('should return error cellStyle when validation returns an error', () => {
      mockValidationFn.mockReturnValue('Error message');
      const result = buildValidationProps(mockValidationFn);
      const cellStyleFn = result?.cellStyle as Function;

      const style = cellStyleFn(mockParams);

      expect(style).toEqual({ backgroundColor: errorColorLight });
      expect(mockValidationFn).toHaveBeenCalledWith(
        'testValue',
        mockNode,
        'testField'
      );
    });

    it('should return default style when validation passes', () => {
      mockValidationFn.mockReturnValue(null);
      const result = buildValidationProps(mockValidationFn, false, '#CCCCCC');
      const cellStyleFn = result?.cellStyle as Function;

      const style = cellStyleFn(mockParams);

      expect(style).toEqual({ backgroundColor: '#CCCCCC' });
    });

    it('should return undefined style when validation passes and no default color is provided', () => {
      mockValidationFn.mockReturnValue(null);
      const result = buildValidationProps(mockValidationFn);
      const cellStyleFn = result?.cellStyle as Function;

      const style = cellStyleFn(mockParams);

      expect(style).toBeUndefined();
    });
  });

  describe('rowIsEmpty', () => {
    it('should return true for empty row', () => {
      const emptyRow = {
        data: { field1: '', field2: null, field3: undefined },
      } as any;
      expect(rowIsEmpty(emptyRow)).toBe(true);
    });

    it('should return false when row has at least one non-empty value', () => {
      const nonEmptyRow = {
        data: { field1: '', field2: 'value', field3: null },
      } as any;
      expect(rowIsEmpty(nonEmptyRow)).toBe(false);
    });

    it('should handle rows with falsy but valid values correctly', () => {
      const rowWithZero = {
        data: { field1: '', field2: 0, field3: null },
      } as any;
      expect(rowIsEmpty(rowWithZero)).toBe(false);

      const rowWithFalse = {
        data: { field1: '', field2: false, field3: null },
      } as any;
      expect(rowIsEmpty(rowWithFalse)).toBe(false);
    });
  });

  describe('getColumIdFromColumnDef', () => {
    it('should return field from ColDef', () => {
      const colDef = { field: 'testField' };
      expect(getColumIdFromColumnDef(colDef)).toBe('testField');
    });

    it('should return groupId from ColGroupDef', () => {
      const colDef = { groupId: 'testGroup' } as any;
      expect(getColumIdFromColumnDef(colDef)).toBe('testGroup');
    });

    it('should prioritize field over groupId if both exist', () => {
      const colDef = { field: 'testField', groupId: 'testGroup' } as any;
      expect(getColumIdFromColumnDef(colDef)).toBe('testField');
    });

    it('should return undefined for null or undefined input', () => {
      expect(getColumIdFromColumnDef(null)).toBeUndefined();
      expect(getColumIdFromColumnDef(undefined as any)).toBeUndefined();
    });

    it('should return undefined when neither field nor groupId exist', () => {
      const colDef = { someOtherProp: 'value' } as any;
      expect(getColumIdFromColumnDef(colDef)).toBeUndefined();
    });
  });
});
