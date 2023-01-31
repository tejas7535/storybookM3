import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { loadFilterDimensionData } from '../../../core/store/actions';
import * as filterSelectors from '../../../core/store/selectors/filter/filter.selector';
import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import {
  ASYNC_SEARCH_MIN_CHAR_LENGTH,
  LOCAL_SEARCH_MIN_CHAR_LENGTH,
} from '../../../shared/constants';
import {
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../shared/models';
import { SelectInputModule } from '../../../shared/select-input/select-input.module';
import {
  loadUserSettingsDimensionData,
  updateUserSettings,
} from '../../store/actions/user.action';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

describe('UserSettingsDialogComponent', () => {
  let component: UserSettingsDialogComponent;
  let spectator: Spectator<UserSettingsDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UserSettingsDialogComponent,
    detectChanges: false,
    imports: [
      AutocompleteInputModule,
      MatDialogModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      SelectInputModule,
      PushModule,
    ],
    providers: [
      provideMockStore(),
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          dimension: FilterDimension.SEGMENT,
          selectedDimensionIdValue: new IdValue('3', 'Super Segement'),
          initialLoad: true,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateDimension', () => {
    test('should handle dimension update', () => {
      component.updateDimensionName = jest.fn();
      component.updateDimension(FilterDimension.COUNTRY);

      expect(component.activeDimension).toEqual(FilterDimension.COUNTRY);
      expect(component.updateDimensionName).toHaveBeenCalledTimes(1);
      expect(component.minCharLength).toEqual(LOCAL_SEARCH_MIN_CHAR_LENGTH);
      expect(component.dimensionFilter$).toBeDefined();
      expect(component.selectedDimensionIdValue).toBeUndefined();
    });

    test('should set minCharLength to ASYNC if org unit', () => {
      component.updateDimensionName = jest.fn();
      component.updateDimension(FilterDimension.ORG_UNIT);

      expect(component.activeDimension).toEqual(FilterDimension.ORG_UNIT);
      expect(component.minCharLength).toEqual(ASYNC_SEARCH_MIN_CHAR_LENGTH);
    });
  });

  describe('updateDimensionName', () => {
    test('should update dimension name if found', () => {
      component.availableDimensions = [
        { id: 'REGION', value: '2' },
        { id: 'BOARD', value: '4' },
      ];
      component.activeDimension = FilterDimension.REGION;

      component.updateDimensionName();

      expect(component.dimensionName).toEqual('2');
    });

    test('should do nothing if availableDimensions not set', () => {
      component.availableDimensions = undefined;
      component.activeDimension = FilterDimension.REGION;

      component.updateDimensionName();

      expect(component.dimensionName).toBeUndefined();
    });

    test('should do nothing if not found', () => {
      component.availableDimensions = [
        { id: 'REGION', value: '2' },
        { id: 'BOARD', value: '4' },
      ];
      component.activeDimension = FilterDimension.SUB_BOARD;

      component.updateDimensionName();

      expect(component.dimensionName).toBeUndefined();
    });
  });
  describe('selectDimensionDataOption', () => {
    test('should set option', () => {
      const option = new SelectedFilter('test', {
        id: 'Sales',
        value: 'Sales',
      });

      component.selectDimensionDataOption(option);

      expect(component.selected).toEqual(option);
    });
  });

  describe('invalidDimensionData', () => {
    test('should set invalidDimensionDataInput according input', () => {
      component.invalidDimensionData(true);

      expect(component.invalidDimensionDataInput).toBeTruthy();
    });
  });

  describe('saveUserSettings', () => {
    test('should dispatch updateUserSettings actions', () => {
      const option = new SelectedFilter('test', {
        id: 'Sales',
        value: 'Sales',
      });
      component.selected = option;

      component.activeDimension = FilterDimension.BOARD;

      component.saveUserSettings();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateUserSettings({
          data: {
            dimension: FilterDimension.BOARD,
            dimensionKey: option.idValue.id,
            dimensionDisplayName: option.idValue.value,
          },
        })
      );
    });
  });

  describe('autoCompleteSelectedDimensionIdValueChange', () => {
    test('should emit search string when asyncMode', () => {
      const searchFor = 'search';
      component.activeDimension = FilterDimension.ORG_UNIT;

      component.autoCompleteSelectedDimensionIdValueChange(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadUserSettingsDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        })
      );
    });

    test(
      'should set dimension filter and not filter options if search too short',
      marbles((m) => {
        const searchFor = '';
        const fakeFilter = {
          options: [] as any[],
          name: FilterDimension.BOARD,
        };
        jest
          .spyOn(filterSelectors, 'getSpecificDimensonFilter')
          .mockImplementation(() => createSelector(() => fakeFilter));
        component.activeDimension = FilterDimension.BOARD;

        component.autoCompleteSelectedDimensionIdValueChange(searchFor);

        m.expect(component.dimensionFilter$).toBeObservable(
          m.cold('a', { a: fakeFilter })
        );
      })
    );

    test(
      'should set dimension filter and filter options',
      marbles((m) => {
        const searchFor = 'te';
        const fakeFilter = {
          options: [
            { value: 'te' } as IdValue,
            { value: 'emte' } as IdValue,
            { value: 'arg' } as IdValue,
            { value: 'yay' } as IdValue,
          ],
          name: FilterDimension.BOARD,
        };
        jest
          .spyOn(filterSelectors, 'getSpecificDimensonFilter')
          .mockImplementation(() => createSelector(() => fakeFilter));
        component.activeDimension = FilterDimension.BOARD;

        const expectedFilter = {
          options: [{ value: 'te' } as IdValue],
          name: FilterDimension.BOARD,
        };

        component.autoCompleteSelectedDimensionIdValueChange(searchFor);

        m.expect(component.dimensionFilter$).toBeObservable(
          m.cold('a', { a: expectedFilter })
        );
      })
    );
  });

  describe('selectDimension', () => {
    test('should dispatch action and update dimension', () => {
      const idVal = new IdValue('2', 'value');

      component.updateDimension = jest.fn();

      component.selectDimension(idVal);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterDimensionData({
          filterDimension: idVal.id as FilterDimension,
        })
      );
      expect(component.updateDimension).toHaveBeenCalledWith(
        idVal.id as FilterDimension
      );
    });
  });

  describe('mapTranslationsToIdValues', () => {
    test('should map translations to id value filter dimensions', () => {
      const translations = {
        [FilterDimension.ORG_UNIT]: 'org unit',
        [FilterDimension.REGION]: 'region',
        [FilterDimension.SUB_REGION]: 'sub region',
        [FilterDimension.COUNTRY]: 'country',
        [FilterDimension.BOARD]: 'board',
        [FilterDimension.SUB_BOARD]: 'sub board',
        [FilterDimension.FUNCTION]: 'function',
        [FilterDimension.SUB_FUNCTION]: 'sub function',
        [FilterDimension.SEGMENT]: 'segment',
        [FilterDimension.SUB_SEGMENT]: 'sub segment',
        [FilterDimension.SEGMENT_UNIT]: 'segment unit',
      };

      const result = component.mapTranslationsToIdValues(translations);

      expect(result.length).toBe(11);
      expect(result[0]).toEqual(
        new IdValue(
          FilterDimension.ORG_UNIT,
          translations[FilterDimension.ORG_UNIT],
          0
        )
      );
      expect(result[1]).toEqual(
        new IdValue(
          FilterDimension.REGION,
          translations[FilterDimension.REGION],
          0
        )
      );
      expect(result[2]).toEqual(
        new IdValue(
          FilterDimension.SUB_REGION,
          translations[FilterDimension.SUB_REGION],
          1
        )
      );
      expect(result[3]).toEqual(
        new IdValue(
          FilterDimension.COUNTRY,
          translations[FilterDimension.COUNTRY],
          2
        )
      );
      expect(result[4]).toEqual(
        new IdValue(
          FilterDimension.BOARD,
          translations[FilterDimension.BOARD],
          0
        )
      );
      expect(result[5]).toEqual(
        new IdValue(
          FilterDimension.SUB_BOARD,
          translations[FilterDimension.SUB_BOARD],
          1
        )
      );
      expect(result[6]).toEqual(
        new IdValue(
          FilterDimension.FUNCTION,
          translations[FilterDimension.FUNCTION],
          2
        )
      );
      expect(result[7]).toEqual(
        new IdValue(
          FilterDimension.SUB_FUNCTION,
          translations[FilterDimension.SUB_FUNCTION],
          3
        )
      );
      expect(result[8]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT,
          translations[FilterDimension.SEGMENT],
          0
        )
      );
      expect(result[9]).toEqual(
        new IdValue(
          FilterDimension.SUB_SEGMENT,
          translations[FilterDimension.SUB_SEGMENT],
          1
        )
      );
      expect(result[10]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT_UNIT,
          translations[FilterDimension.SEGMENT_UNIT],
          2
        )
      );
    });
  });
});
