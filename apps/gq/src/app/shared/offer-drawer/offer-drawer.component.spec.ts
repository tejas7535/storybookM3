import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { OfferTableModule } from '../offer-table/offer-table.module';
import { OfferDrawerComponent } from './offer-drawer.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferDrawerComponent', () => {
  let component: OfferDrawerComponent;
  let spectator: Spectator<OfferDrawerComponent>;

  const createComponent = createComponentFactory({
    component: OfferDrawerComponent,
    declarations: [OfferDrawerComponent],
    imports: [
      OfferTableModule,
      LoadingSpinnerModule,
      MatIconModule,
      MatButtonModule,
      ReactiveComponentModule,
      RouterTestingModule,
      provideTranslocoTestingModule({}),
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
          'azure-auth': {
            accountInfo: {
              name: 'Jefferson',
            },
            profileImage: {
              url: 'img',
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

  test('toggle drawer', () => {
    component['toggleOfferDrawer'].emit = jest.fn();

    component.drawerToggle();
    expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
  });
});
