import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { mockProvider } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  searchBearingForAdvancedSelection,
  searchBearingForAdvancedSelectionCount,
} from '@ga/core/store';
import { RangeFilterModule } from '@ga/shared/components/range-filter';
import {
  ADVANCED_BEARING_SELECTION_FILTERS_MOCK,
  RANGE_FILTER_MOCK,
} from '@ga/testing/mocks';

import { AdvancedBearingSelectionComponent } from './advanced-bearing-selection.component';
import {
  BearingSelectionButtonComponent,
  BearingSelectionFiltersSummaryModule,
  BearingSelectionListModule,
} from './components';
import { AdvancedBearingSelectionService } from './services/advanced-bearing-selection.service';

describe('AdvancedBearingSelectionComponent', () => {
  let component: AdvancedBearingSelectionComponent;
  let spectator: Spectator<AdvancedBearingSelectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AdvancedBearingSelectionComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(PushModule),
      MockModule(MatButtonModule),
      MockModule(MatDividerModule),
      MockModule(MatIconModule),
      MockModule(MatExpansionModule),
      MockModule(MatFormFieldModule),
      MockModule(MatSelectModule),
      MockModule(RangeFilterModule),
      MockModule(BearingSelectionListModule),
      MockModule(BearingSelectionFiltersSummaryModule),
      MockComponent(BearingSelectionButtonComponent),
    ],
    providers: [
      mockProvider(AdvancedBearingSelectionService, {
        getBoreDiameterRangeFilter: jest.fn(() => RANGE_FILTER_MOCK),
        getOutsideDiameterRangeFilter: jest.fn(() => RANGE_FILTER_MOCK),
        getWidthRangeFilter: jest.fn(() => RANGE_FILTER_MOCK),
      }),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('prevStep', () => {
    it('should reduce the step', () => {
      component.step = 3;
      component.prevStep();

      expect(component.step).toEqual(2);
    });
  });

  describe('onBoreDiameterChange', () => {
    it('should set boreDiameter props', () => {
      component.onBoreDiameterChange(RANGE_FILTER_MOCK);

      expect(component.boreDiameterRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.advancedBearingSelectionFilters.boreDiameterMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.advancedBearingSelectionFilters.boreDiameterMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });

  describe('onOutsideDiameterChange', () => {
    it('should set outsideDiameter props', () => {
      component.onOutsideDiameterChange(RANGE_FILTER_MOCK);

      expect(component.outsideDiameterRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.advancedBearingSelectionFilters.outsideDiameterMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.advancedBearingSelectionFilters.outsideDiameterMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });

  describe('onWidthChange', () => {
    it('should set width props', () => {
      component.onWidthChange(RANGE_FILTER_MOCK);

      expect(component.widthRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.advancedBearingSelectionFilters.widthMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.advancedBearingSelectionFilters.widthMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });

  describe('onBearingSelectionButtonClick', () => {
    it('should increase the step', () => {
      component.step = 3;
      component.onBearingSelectionButtonClick();

      expect(component.step).toEqual(4);
    });

    it('should dispatch fetch action', () => {
      component.advancedBearingSelectionFilters =
        ADVANCED_BEARING_SELECTION_FILTERS_MOCK;

      component.onBearingSelectionButtonClick();

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBearingForAdvancedSelection({
          selectionFilters: ADVANCED_BEARING_SELECTION_FILTERS_MOCK,
        })
      );
    });
  });

  describe('onBearingTypeSelectionChange', () => {
    it('should dispatch fetch action', () => {
      component.advancedBearingSelectionFilters =
        ADVANCED_BEARING_SELECTION_FILTERS_MOCK;

      component.onBearingTypeSelectionChange();

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBearingForAdvancedSelectionCount({
          selectionFilters: ADVANCED_BEARING_SELECTION_FILTERS_MOCK,
        })
      );
    });
  });
});
