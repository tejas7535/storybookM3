import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { mockProvider } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RangeFilterModule } from '@ga/shared/components/range-filter';
import { RANGE_FILTER_MOCK } from '@ga/testing/mocks';

import { AdvancedBearingSelectionComponent } from './advanced-bearing-selection.component';
import {
  BearingSelectionButtonModule,
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
      MockModule(ReactiveComponentModule),
      MockModule(MatButtonModule),
      MockModule(MatDividerModule),
      MockModule(MatIconModule),
      MockModule(MatExpansionModule),
      MockModule(MatFormFieldModule),
      MockModule(MatSelectModule),
      MockModule(RangeFilterModule),
      MockModule(BearingSelectionButtonModule),
      MockModule(BearingSelectionListModule),
      MockModule(BearingSelectionFiltersSummaryModule),
    ],
    providers: [
      mockProvider(AdvancedBearingSelectionService),
      provideMockStore({
        initialState: {
          bearing: {
            search: {
              query: undefined,
              resultList: [],
            },
            extendedSearch: {
              parameters: {
                pattern: '',
                bearingType: 'IDO_RADIAL_ROLLER_BEARING',
                minDi: undefined,
                maxDi: undefined,
                minDa: undefined,
                maxDa: undefined,
                minB: undefined,
                maxB: undefined,
              },
              resultList: [],
            },
            loading: false,
            selectedBearing: undefined,
          },
        },
      }),
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

  describe('onInit', () => {
    it('should trigger the handleSubscriptions', () => {
      const componenthandleSubscriptionsSpy = jest.spyOn(
        component,
        'handleSubscriptions'
      );
      component.ngOnInit();

      expect(componenthandleSubscriptionsSpy).toHaveBeenCalled();
    });
  });

  describe('updateBoreDiameterRangeFilter', () => {
    it('should set boreDiameter props', () => {
      component.onBoreDiameterChange(RANGE_FILTER_MOCK);

      expect(component.boreDiameterRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.extendedSearchParameters.boreDiameterMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.extendedSearchParameters.boreDiameterMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });

  describe('updateOutsideDiameterRangeFilter', () => {
    it('should set outsideDiameter props', () => {
      component.onOutsideDiameterChange(RANGE_FILTER_MOCK);

      expect(component.outsideDiameterRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.extendedSearchParameters.outsideDiameterMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.extendedSearchParameters.outsideDiameterMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });

  describe('updateWidthRangeFilter', () => {
    it('should set width props', () => {
      component.onWidthChange(RANGE_FILTER_MOCK);

      expect(component.widthRangeFilter).toEqual(RANGE_FILTER_MOCK);
      expect(component.extendedSearchParameters.widthMin).toBe(
        RANGE_FILTER_MOCK.minSelected
      );
      expect(component.extendedSearchParameters.widthMax).toBe(
        RANGE_FILTER_MOCK.maxSelected
      );
    });
  });
});
