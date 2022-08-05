import { FormControl } from '@angular/forms';

import { HashMap, translate, TranslocoModule } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import {
  filterFn,
  getErrorMessage,
  getMonths,
  getTranslatedError,
  getYears,
  materialNameFilterFnFactory,
  standardDocumentFilterFnFactory,
  valueOptionKeyToTitleFilterFnFactory,
  valueTitleToOptionKeyFilterFnFactory,
} from '.';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string: string, params?: HashMap) =>
    params && Object.keys(params).length > 0
      ? `${string.split('.').pop()}${Object.values(params).join('')}`
      : string.split('.').pop()
  ),
}));
describe('Dialog Helpers', () => {
  describe('getMonths', () => {
    it('should return an array for months', () => {
      const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const result = getMonths();

      expect(result).toEqual(expected);
    });
  });

  describe('getYears', () => {
    it('should return an array of year from 2000 until today', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2005, 1, 1));

      const expected = [2005, 2004, 2003, 2002, 2001, 2000];
      const result = getYears();

      expect(result).toEqual(expected);

      jest.useRealTimers();
    });
  });

  describe('filterFn', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH ' };
    it('should return true with matching string', () => {
      expect(filterFn(option, option.title)).toBe(true);
    });
    it('should return true with undefined option', () => {
      expect(filterFn(undefined, option.title)).toBe(undefined);
    });
    it('should return true with undefined option title', () => {
      expect(filterFn({ id: 1, title: undefined }, option.title)).toBe(
        undefined
      );
    });
    it('should Skip filter with undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(filterFn(option, undefined)).toBe(true);
    });
    it('should accept with lowercase match', () => {
      expect(filterFn(option, option.title.toLowerCase())).toBe(true);
    });
    it('should accept with uppercase match', () => {
      expect(filterFn(option, option.title.toUpperCase())).toBe(true);
    });
    it('should accept with partial match', () => {
      expect(filterFn(option, option.title.slice(2, 7))).toBe(true);
    });
    it('should accept with empty string', () => {
      expect(filterFn(option, '')).toBe(true);
    });
    it('should accept with trailing whitespace', () => {
      expect(filterFn(option, `${option.title}    `)).toBe(true);
    });
    it('should accept with starting whitespace', () => {
      expect(filterFn(option, `    ${option.title}`)).toBe(true);
    });
  });

  describe('materialNameFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no std doc set', () => {
      const standardDocumentsControl = new FormControl<StringOption>(undefined);
      expect(
        materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with no "data" in  std doc set', () => {
      const stdDoc: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with matching materialName', () => {
      const stdDoc: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: option.title }] },
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        materialNameFilterFnFactory(standardDocumentsControl)(option)
      ).toBe(true);
    });

    it('should return false with not matching materialname', () => {
      const stdDoc: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: 'other matName' }] },
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('standardDocumentFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no material name set', () => {
      const materialNamesControl = new FormControl<StringOption>(undefined);

      expect(
        standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with no "data" in  material name set', () => {
      const matName: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with matching standardDocument', () => {
      const matName: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [{ id: 1, standardDocument: option.title }],
        },
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        standardDocumentFilterFnFactory(materialNamesControl)(option)
      ).toBe(true);
    });

    it('should return false with not matching standardDocument', () => {
      const matName: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [
            { id: 1, standardDocument: 'other standard document' },
          ],
        },
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('valueTitleToOptionKeyFilterFnFactory', () => {
    const control = new FormControl<StringOption>(undefined);
    const option: StringOption = {
      id: 78,
      title: 'aBcDeFgH',
      data: { materialName: 'matName' },
    };
    it('should return true with undefined form value', () => {
      expect(
        valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with undefined title of form value', () => {
      control.setValue({ id: 1, title: undefined });
      expect(
        valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return true with matching title of form value', () => {
      control.setValue({
        id: 1,
        title: 'match',
      });
      expect(
        valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          {
            ...option,
            data: {
              match: 'match',
            },
          },
          option.title
        )
      ).toBe(true);
    });
    it('should return false with nonmatching title of form value', () => {
      control.setValue({ id: 1, title: 'nonmatch' });
      expect(
        valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('valueOptionKeyToTitleFilterFnFactory', () => {
    const control = new FormControl<StringOption>(undefined);
    const option: StringOption = {
      id: 78,
      title: 'aBcDeFgH',
      data: { materialName: 'matName' },
    };
    it('should return true with undefined form value', () => {
      expect(
        valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with undefined data of form value', () => {
      control.setValue({ id: 1, title: 'title', data: undefined });
      expect(
        valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return true with matching title of form value', () => {
      control.setValue({ id: 1, title: 'title', data: { key: option.title } });
      expect(
        valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return false with nonmatching title of form value', () => {
      control.setValue({ id: 1, title: 'title', data: { key: 'sth else' } });
      expect(
        valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('getErrorMessage', () => {
    it('should give error message with required', () => {
      const result = getErrorMessage({ required: true });
      expect(result).toEqual('required');
    });
    it('should give error message with min', () => {
      const result = getErrorMessage({
        min: { min: 1234, current: 99 },
      });
      expect(result).toEqual('min1234');
    });

    it('should give error message with co2', () => {
      const result = getErrorMessage({
        scopeTotalLowerThanSingleScopes: { min: 6, current: 12 },
      });
      expect(result).toEqual('co2TooLowShort6');
    });
    it('should give error message with generic', () => {
      const result = getErrorMessage({ nothing: true });
      expect(result).toEqual('generic');
    });
  });

  describe('getTranslatedError', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('should call translate with the key and empty params', () => {
      getTranslatedError('test');

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.error.test',
        {}
      );
    });

    it('should call translate with the key and params', () => {
      getTranslatedError('test', { test: 'test' });

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.error.test',
        { test: 'test' }
      );
    });
  });
});
