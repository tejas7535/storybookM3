import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import * as parseValues from '../../../../utils/parse-values';
import { ValidationHelper } from '../../../../utils/validation/validation-helper';
import { DateOrOriginalCellRendererComponent } from './date-or-original-cell-renderer.component';

describe('DateOrOriginalCellRendererComponent', () => {
  let spectator: Spectator<DateOrOriginalCellRendererComponent>;
  let component: DateOrOriginalCellRendererComponent;
  const mockParams = {} as SpyObject<ICellRendererParams>;

  const factory = createComponentFactory({
    component: DateOrOriginalCellRendererComponent,
    detectChanges: false,
    providers: [],
  });

  beforeEach(() => {
    spectator = factory();
    component = spectator.component;
  });

  describe('setValue', () => {
    it('should set the value from parameters', () => {
      const testValue = 'test';
      mockParams.value = testValue;

      component['setValue'](mockParams);

      expect(component.value).toEqual(testValue);
    });
  });

  describe('getValue', () => {
    it('should return parsed date if possible', () => {
      const testDateString = '2023-01-01';
      component.value = testDateString;
      jest
        .spyOn(parseValues, 'parseDateIfPossible')
        .mockReturnValue('Jan 01, 2023');

      const result = component['getValue']();

      expect(result).toEqual('Jan 01, 2023');
    });
  });

  describe('getDateFormat', () => {
    it('should return date format from ValidationHelper', () => {
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('MM/DD/YYYY');

      const result = component['getDateFormat']();

      expect(result).toEqual('mm/dd/yyyy');
    });
  });
});
