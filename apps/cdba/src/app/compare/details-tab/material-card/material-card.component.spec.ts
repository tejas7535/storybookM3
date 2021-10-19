import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { marbles } from 'rxjs-marbles/marbles';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import { SharedModule } from '@cdba/shared';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import * as enJson from '../../../../assets/i18n/compare/en.json';
import { AdditionalInformationWidgetModule } from '../additional-information-widget/additional-information-widget.module';
import { AdditionalInformation } from '../additional-information-widget/additional-information.model';
import { DimensionsWidgetModule } from '../dimensions-widget/dimensions-widget.module';
import { MaterialCardComponent } from './material-card.component';

describe('MaterialCardComponent', () => {
  let component: MaterialCardComponent;
  let spectator: Spectator<MaterialCardComponent>;

  const createComponent = createComponentFactory({
    component: MaterialCardComponent,
    imports: [
      SharedModule,
      MatCardModule,
      MatExpansionModule,
      provideTranslocoTestingModule({ en: enJson }),
      MockModule(DimensionsWidgetModule),
      MockModule(AdditionalInformationWidgetModule),
    ],
    providers: [
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
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

        const expectedAdditionalInformation: AdditionalInformation = {
          plant: 'IWS',
          procurementType: 'in-house',
          salesOrganization: '0060',
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
});
