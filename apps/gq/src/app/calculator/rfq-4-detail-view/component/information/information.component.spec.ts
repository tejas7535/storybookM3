import { signal } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponents } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK } from '../../../../../testing/mocks';
import {
  CALCULATOR_QUOTATION_DATA_MOCK,
  CALCULATOR_QUOTATION_DETAIL_DATA_MOCK,
  CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
} from '../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { Rfq4DetailViewStore } from '../../store/rfq-4-detail-view.store';
import { HeaderInformationComponent } from './header-information/header-information.component';
import { InformationComponent } from './information.component';
import { PositionInformationComponent } from './position-information/position-information.component';
import { RfqInformationComponent } from './rfq-information/rfq-information.component';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let spectator: Spectator<InformationComponent>;

  const createComponent = createComponentFactory({
    component: InformationComponent,
    imports: [
      MockComponents(
        PositionInformationComponent,
        HeaderInformationComponent,
        RfqInformationComponent
      ),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getQuotationDetailData: signal(CALCULATOR_QUOTATION_DETAIL_DATA_MOCK),
          getQuotationData: signal(CALCULATOR_QUOTATION_DATA_MOCK),
          getRfq4ProcessData: signal(CALCULATOR_RFQ_4_PROCESS_DATA_MOCK),
          processStartedByAdUser: signal(null),
          processAssignedToAdUser: signal(null),
        },
      },
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
