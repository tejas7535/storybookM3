import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
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
      PushPipe,
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
      component.updateDimension(FilterDimension.COUNTRY);

      expect(component.activeDimension).toEqual(FilterDimension.COUNTRY);
      expect(component.dimensionFilter$).toBeDefined();
      expect(component.selectedDimensionIdValue).toBeUndefined();
    });

    test('should set active dimension', () => {
      component.updateDimension(FilterDimension.ORG_UNIT);

      expect(component.activeDimension).toEqual(FilterDimension.ORG_UNIT);
      expect(component.selectedDimensionIdValue).toBeUndefined();
    });
  });

  describe('onDimensionOptionSelected', () => {
    test('should set option', () => {
      const option = new SelectedFilter('test', {
        id: 'Sales',
        value: 'Sales',
      });

      component.onDimensionOptionSelected(option);

      expect(component.selected).toEqual(option);
      expect(component.selectedDimensionIdValue).toEqual(option.idValue);
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

  describe('onDimensionAutocompleteInput', () => {
    test('should emit search string and dimension', () => {
      const searchFor = 'search';
      component.activeDimension = FilterDimension.ORG_UNIT;
      store.dispatch = jest.fn();

      component.onDimensionAutocompleteInput(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadUserSettingsDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        })
      );
    });
  });

  describe('onDimensionSelected', () => {
    test('should dispatch action and update dimension', () => {
      const idVal = new IdValue('2', 'value');

      component.updateDimension = jest.fn();

      component.onDimensionSelected(idVal);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadUserSettingsDimensionData({
          filterDimension: idVal.id as FilterDimension,
          searchFor: '',
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
