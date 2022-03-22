import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../../shared/date-input/date-input.module';
import { FilterKey, IdValue } from '../../shared/models';
import { SelectInputModule } from '../../shared/select-input/select-input.module';
import { getBeautifiedTimeRange } from '../../shared/utils/utilities';
import { ExpandedFiltersComponent } from './expanded-filters.component';
describe('ExpandedFiltersComponent', () => {
  let component: ExpandedFiltersComponent;
  let spectator: Spectator<ExpandedFiltersComponent>;

  const createComponent = createComponentFactory({
    component: ExpandedFiltersComponent,
    imports: [
      NoopAnimationsModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({ en }),
      ReactiveComponentModule,
      SelectInputModule,
      DateInputModule,
      MatIconModule,
      MatTooltipModule,
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set selectedOrgUnit', () => {
    test('should set org unit and enable time range filter', () => {
      const orgUnit = {
        id: 'orgUnit',
        value: 'orgUnit',
      };

      component.selectedOrgUnit = orgUnit;

      expect(component.selectedOrgUnit).toEqual(orgUnit);
      expect(component.disabledTimeRangeFilter).toBeFalsy();
    });

    test('should disable range filter if org unit not set', () => {
      const orgUnit: IdValue = undefined;

      component.selectedOrgUnit = orgUnit;

      expect(component.selectedOrgUnit).toBeUndefined();
      expect(component.disabledTimeRangeFilter).toBeTruthy();
    });
  });

  describe('optionSelected', () => {
    test('should emit filter', () => {
      component.selectFilter.emit = jest.fn();
      const filter = {
        name: 'test',
        idValue: {
          id: '12',
          value: '12',
        },
      };

      component.optionSelected(filter);

      expect(component.selectFilter.emit).toHaveBeenCalledWith(filter);
    });
  });

  describe('orgUnitInvalid', () => {
    test('should set disabledTimeRangeFilter according to input', () => {
      component.orgUnitInvalid(false);

      expect(component.disabledTimeRangeFilter).toBeFalsy();
    });
  });

  describe('timePeriodSelected', () => {
    test('should emit timePeriod', () => {
      component.selectTimePeriod.emit = jest.fn();
      const idValue = {
        id: 'MONTH',
        value: 'Month',
      };

      component.timePeriodSelected(idValue);

      expect(component.selectTimePeriod.emit).toHaveBeenCalledWith('MONTH');
    });
  });

  describe('timeRangeSelected', () => {
    test('should emit selectFilter', () => {
      component.selectFilter.emit = jest.fn();
      const timeRange = '0-2';

      component.timeRangeSelected(timeRange);

      expect(component.selectFilter.emit).toHaveBeenCalledWith({
        name: FilterKey.TIME_RANGE,
        idValue: {
          id: timeRange,
          value: getBeautifiedTimeRange(timeRange),
        },
      });
    });
  });

  describe('autoCompleteOrgUnitsChange', () => {
    test('should emit autoCompleteOrgUnits', () => {
      component.autoCompleteOrgUnits.emit = jest.fn();
      const searchFor = 'search';

      component.autoCompleteOrgUnitsChange(searchFor);

      expect(component.autoCompleteOrgUnits.emit).toHaveBeenCalledWith(
        searchFor
      );
    });
  });
});
