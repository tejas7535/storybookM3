import { ChangeDetectorRef, ElementRef, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';

import { HashMap, translate, TranslocoModule } from '@jsverse/transloco';

import { StringOption } from '@schaeffler/inputs';

import {
  createSupplierBusinessPartnerIdValidator,
  filterFn,
  focusSelectedElement,
  getErrorMessage,
  getMonths,
  getTranslatedError,
  getYears,
  valueOptionKeyToTitleFilterFnFactory,
  valueTitleToOptionKeyFilterFnFactory,
} from '.';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
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

    it('should give error message with co2 to low', () => {
      const result = getErrorMessage({
        scopeTotalLowerThanSingleScopes: { min: 6, current: 12 },
      });
      expect(result).toEqual('co2TooLowShort6');
    });
    it('should give error message with co2 to high', () => {
      const result = getErrorMessage({
        scopeTotalHigherThanSingleScopes: { max: 12, current: 6 },
      });
      expect(result).toEqual('co2TooHighShort12');
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

  describe('focusSelectedElement', () => {
    const nameMatch = {
      name: 'lookup',
      focus: jest.fn(),
    };
    const htmlMatch = {
      outerHTML: 'name="lookup"',
      focus: jest.fn(),
      querySelector: jest.fn(),
      scrollIntoView: jest.fn(),
    };
    let cdRef: ChangeDetectorRef;

    beforeEach(() => {
      cdRef = {} as ChangeDetectorRef;
    });

    it('should focus matching by name', () => {
      cdRef.markForCheck = jest.fn();
      cdRef.detectChanges = jest.fn();

      const changes: ElementRef[] = [
        new ElementRef({ name: 'nomatch' }),
        new ElementRef(nameMatch),
      ];

      focusSelectedElement(
        changes as unknown as QueryList<ElementRef>,
        'lookup',
        cdRef
      );

      expect(nameMatch.focus).toHaveBeenCalled();
      expect(cdRef.markForCheck).toHaveBeenCalled();
      expect(cdRef.detectChanges).toHaveBeenCalled();
    });
    it('should focus matching html element', () => {
      cdRef.markForCheck = jest.fn();
      cdRef.detectChanges = jest.fn();

      const changes: ElementRef[] = [
        new ElementRef({ outerHTML: 'nomatch' }),
        new ElementRef(htmlMatch),
      ];

      focusSelectedElement(
        changes as unknown as QueryList<ElementRef>,
        'lookup',
        cdRef
      );

      expect(htmlMatch.focus).toHaveBeenCalled();
      expect(htmlMatch.scrollIntoView).toHaveBeenCalled();
      expect(htmlMatch.querySelector).toHaveBeenCalledWith('mat-select');
      expect(htmlMatch.querySelector).toHaveBeenCalledWith('input');
      expect(cdRef.markForCheck).toHaveBeenCalled();
      expect(cdRef.detectChanges).toHaveBeenCalled();
    });

    it('should focus html child element mat-select', () => {
      cdRef.markForCheck = jest.fn();
      cdRef.detectChanges = jest.fn();
      const result = { focus: jest.fn() };
      const htmlMatchMatSelect = {
        outerHTML: 'name="lookup"',
        focus: jest.fn(),
        querySelector: jest.fn((s: string) =>
          s === 'mat-select' ? result : undefined
        ),
        scrollIntoView: jest.fn(),
      };

      const changes: ElementRef[] = [
        new ElementRef({ outerHTML: 'nomatch' }),
        new ElementRef(htmlMatchMatSelect),
      ];

      focusSelectedElement(
        changes as unknown as QueryList<ElementRef>,
        'lookup',
        cdRef
      );

      expect(result.focus).toHaveBeenCalled();
      expect(htmlMatchMatSelect.scrollIntoView).toHaveBeenCalled();
      expect(htmlMatchMatSelect.querySelector).toHaveBeenCalledWith(
        'mat-select'
      );
      expect(htmlMatchMatSelect.querySelector).toHaveBeenCalledWith('input');
      expect(htmlMatchMatSelect.focus).not.toHaveBeenCalled();
      expect(cdRef.markForCheck).toHaveBeenCalled();
      expect(cdRef.detectChanges).toHaveBeenCalled();
    });

    it('should focus html child element input', () => {
      cdRef.markForCheck = jest.fn();
      cdRef.detectChanges = jest.fn();
      const result = { focus: jest.fn() };
      const htmlMatchInput = {
        outerHTML: 'name="lookup"',
        focus: jest.fn(),
        querySelector: jest.fn((s: string) =>
          s === 'input' ? result : undefined
        ),
        scrollIntoView: jest.fn(),
      };

      const changes: ElementRef[] = [
        new ElementRef({ outerHTML: 'nomatch' }),
        new ElementRef(htmlMatchInput),
      ];

      focusSelectedElement(
        changes as unknown as QueryList<ElementRef>,
        'lookup',
        cdRef
      );

      expect(result.focus).toHaveBeenCalled();
      expect(htmlMatchInput.scrollIntoView).toHaveBeenCalled();
      expect(htmlMatchInput.querySelector).toHaveBeenCalledWith('mat-select');
      expect(htmlMatchInput.querySelector).toHaveBeenCalledWith('input');
      expect(htmlMatchInput.focus).not.toHaveBeenCalled();
      expect(cdRef.markForCheck).toHaveBeenCalled();
      expect(cdRef.detectChanges).toHaveBeenCalled();
    });
  });

  describe('createSapSupplierIDValidator', () => {
    const toStrOpt = (name: string) => ({ title: name }) as StringOption;
    it('Should create a validator (undefined)', () => {
      const control = new FormControl<StringOption[]>(undefined);
      control.addValidators(
        createSupplierBusinessPartnerIdValidator('S\\d{9}')
      );

      expect(control.valid).toBeTruthy();
    });

    it('Should validate correct values', () => {
      const control = new FormControl<StringOption[]>(undefined);
      control.addValidators(
        createSupplierBusinessPartnerIdValidator('S\\d{9}')
      );
      control.setValue([toStrOpt('S123456789')]);
      expect(control.valid).toBeTruthy();
    });

    it('Should validate incorrect values correctly', () => {
      const control = new FormControl<StringOption[]>(undefined);
      control.addValidators(
        createSupplierBusinessPartnerIdValidator('S\\d{9}')
      );
      control.setValue([toStrOpt('S123456789'), toStrOpt('S1234')]);
      expect(control.valid).toBeFalsy();
    });
  });
});
