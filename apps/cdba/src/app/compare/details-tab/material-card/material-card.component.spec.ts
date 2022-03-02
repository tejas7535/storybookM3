import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { of } from 'rxjs';

import {
  AdditionalInformationDetails,
  DimensionAndWeightDetails,
} from '@cdba/shared/models';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdditionalInformationWidgetModule } from '../additional-information-widget/additional-information-widget.module';
import { DimensionsWidgetModule } from '../dimensions-widget/dimensions-widget.module';
import { MaterialCardComponent } from './material-card.component';
import { MaterialCardStore } from './material-card.store';

describe('MaterialCardComponent', () => {
  let component: MaterialCardComponent;
  let spectator: Spectator<MaterialCardComponent>;

  const createComponent = createComponentFactory({
    component: MaterialCardComponent,
    imports: [
      ReactiveComponentModule,
      MockModule(MatCardModule),
      MockModule(MatExpansionModule),
      provideTranslocoTestingModule({ en: {} }),
      MockModule(DimensionsWidgetModule),
      MockModule(AdditionalInformationWidgetModule),
    ],
    providers: [
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
      {
        provide: MaterialCardStore,
        useValue: {
          expandedItems$: of([0, 1]),
          addExpandedItem: jest.fn(),
          removeExpandedItem: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { index: 0 } });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should set store observables',
      marbles((m) => {
        component.ngOnInit();

        m.expect(component.materialDesignation$).toBeObservable(
          m.cold('a', { a: 'F-446509.SLH' })
        );

        const expectedAdditionalInformation: AdditionalInformationDetails = {
          plant: 'IWS',
          procurementType: 'in-house',
          salesOrganizations: ['0060'],
          plannedQuantities: [30_000, 350_000, 400_000, 500_000],
          actualQuantities: [250_000, 200_000, 44_444, 2_345_345],
        };
        m.expect(component.additionalInformation$).toBeObservable(
          m.cold('a', { a: expectedAdditionalInformation })
        );

        const expectedDimensions: DimensionAndWeightDetails = {
          height: 7,
          width: 10,
          length: 10,
          unitOfDimension: 'mm',
          weight: 10,
          weightUnit: 'gramm',
          volumeCubic: 200,
          volumeUnit: 'mm^3',
        };
        m.expect(component.dimensionAndWeightDetails$).toBeObservable(
          m.cold('a', { a: expectedDimensions })
        );

        m.expect(component.errorMessage$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
  });

  describe('onExpansionOpened', () => {
    it('should add store item', () => {
      component.addExpandedItem(0);

      expect(component['materialCardStore'].addExpandedItem).toBeCalledWith(0);
    });
  });

  describe('onExpansionClosed', () => {
    it('should remove store item', () => {
      component.removeExpandedItem(0);

      expect(component['materialCardStore'].removeExpandedItem).toBeCalledWith(
        0
      );
    });
  });
});
