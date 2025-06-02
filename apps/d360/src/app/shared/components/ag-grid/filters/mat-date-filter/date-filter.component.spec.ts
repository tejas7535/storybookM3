import { FormControl } from '@angular/forms';

import { IDateParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DateFilterComponent>({
      component: DateFilterComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should initialize the params', () => {
      const mockParams: IDateParams = { onDateChanged: jest.fn() } as any;

      component.agInit(mockParams);

      expect(component['params']).toEqual(mockParams);
    });
  });

  describe('onDateChanged', () => {
    it('should call the onDateChanged method from params', () => {
      const mockOnDateChanged = jest.fn();
      component['params'] = {
        onDateChanged: mockOnDateChanged,
      } as any;

      component.onDateChanged();

      expect(mockOnDateChanged).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDate', () => {
    it('should return the control value', () => {
      component['control'] = new FormControl(null);
      const mockDate = new Date();
      component['control'].setValue(mockDate);

      const result = component.getDate();

      expect(result).toEqual(mockDate);
    });
  });

  describe('setDate', () => {
    it('should set the control value', () => {
      component['control'] = new FormControl(null);
      const mockDate = new Date();

      component.setDate(mockDate);

      expect(component['control'].getRawValue()).toEqual(mockDate);
    });

    it('should set the control value to null when date is falsy', () => {
      component['control'] = new FormControl(new Date());

      component.setDate(null);

      expect(component['control'].getRawValue()).toBeNull();
    });
  });

  describe('setInputPlaceholder', () => {
    it('should set the placeholder attribute on the native element', () => {
      // Mock the mdcInput element reference
      const mockNativeElement = { setAttribute: jest.fn() };
      (component as any)['mdcInput'] = jest
        .fn()
        .mockReturnValue({ nativeElement: mockNativeElement });
      component['placeholder'] = 'test-placeholder';

      component.setInputPlaceholder();

      expect(mockNativeElement.setAttribute).toHaveBeenCalledWith(
        'placeholder',
        'test-placeholder'
      );
    });
  });

  describe('setInputAriaLabel', () => {
    it('should set the aria-label attribute on the native element', () => {
      // Mock the mdcInput element reference
      const mockNativeElement = { setAttribute: jest.fn() };
      (component as any)['mdcInput'] = jest
        .fn()
        .mockReturnValue({ nativeElement: mockNativeElement });
      const testLabel = 'test-aria-label';

      component.setInputAriaLabel(testLabel);

      expect(mockNativeElement.setAttribute).toHaveBeenCalledWith(
        'aria-label',
        testLabel
      );
    });
  });
});
