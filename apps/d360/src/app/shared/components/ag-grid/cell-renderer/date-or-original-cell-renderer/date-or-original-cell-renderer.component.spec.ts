import * as parseValues from '../../../../utils/parse-values';
import { ValidationHelper } from '../../../../utils/validation/validation-helper';
import { Stub } from './../../../../test/stub.class';
import { DateOrOriginalCellRendererComponent } from './date-or-original-cell-renderer.component';

describe('DateOrOriginalCellRendererComponent', () => {
  let component: DateOrOriginalCellRendererComponent;
  const mockParams = {} as any;

  beforeEach(() => {
    component = Stub.get<DateOrOriginalCellRendererComponent>({
      component: DateOrOriginalCellRendererComponent,
    });
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
