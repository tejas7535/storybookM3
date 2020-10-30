import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { SharedModule } from '../shared';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
import { OfferHeaderModule } from './offer-header/offer-header.module';
import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferViewComponent', () => {
  let component: OfferViewComponent;
  let spectator: Spectator<OfferViewComponent>;

  const createComponent = createComponentFactory({
    component: OfferViewComponent,
    declarations: [OfferViewComponent],
    imports: [
      OfferHeaderModule,
      OfferTableModule,
      OfferViewRoutingModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule,
      SharedModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            customer: {
              item: CUSTOMER_MOCK,
            },
            quotation: {
              item: QUOTATION_MOCK,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
