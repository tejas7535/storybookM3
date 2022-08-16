import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import moment from 'moment';

import { CustomDateFilterComponent } from './custom-date-filter.component';

describe('CustomDateFilterComponent', () => {
  let component: CustomDateFilterComponent;
  let spectator: Spectator<CustomDateFilterComponent>;

  const createComponent = createComponentFactory({
    component: CustomDateFilterComponent,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params = {} as IFilterParams;
      component.agInit(params);

      expect(component.params).toEqual(params);
    });
  });
  describe('takeValueFromFloatingFilter', () => {
    test('should set component compareDate', () => {
      component.params = {
        filterChangedCallback: jest.fn(),
      } as any as IFilterParams;
      const compareMoment = moment(
        new Date(
          'Fri Aug 12 2022 09:21:06 GMT+0200 (Mitteleuropäische Sommerzeit)'
        )
      );

      component.takeValueFromFloatingFilter(compareMoment);

      expect(component.compareMoment).toEqual(compareMoment);
      expect(component.params.filterChangedCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('isFilterActive', () => {
    test('should return true', () => {
      component.compareMoment = moment(
        new Date(
          'Fri Aug 12 2022 09:21:06 GMT+0200 (Mitteleuropäische Sommerzeit)'
        )
      );
      expect(component.isFilterActive()).toBeTruthy();
    });
    test('should return false', () => {
      component.compareMoment = undefined as any;
      expect(component.isFilterActive()).toBeFalsy();
    });
  });

  describe('doesFilterPass', () => {
    const params = {
      data: {
        dateId: new Date('2020-12-02T02:00:00'),
      },
    } as any as IDoesFilterPassParams;

    const iFilterParams = {
      column: {
        getColId: () => 'dateId',
      },
    } as any as IFilterParams;

    beforeEach(() => {
      component.params = iFilterParams;
    });
    test('should pass on equal date', () => {
      component.compareMoment = moment(new Date('2020-12-02T00:00:00'));

      expect(component.doesFilterPass(params)).toBeTruthy();
    });
    test('should pass on missing compare date', () => {
      component.compareMoment = undefined as any;

      expect(component.doesFilterPass(params)).toBeTruthy();
    });
    test('should not pass on mismatching compare date', () => {
      component.compareMoment = moment(new Date('2020-12-05T00:00:00'));

      expect(component.doesFilterPass(params)).toBeFalsy();
    });
  });
});
