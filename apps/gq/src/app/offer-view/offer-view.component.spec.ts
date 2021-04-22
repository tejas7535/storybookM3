import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { HeaderContentModule } from '../process-case-view/header-content/header-content.module';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
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
      CaseHeaderModule,
      OfferTableModule,
      OfferViewRoutingModule,
      MatIconModule,
      HeaderContentModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
      RouterTestingModule,
      SharedModule,
      LoadingSpinnerModule,
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
