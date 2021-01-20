import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
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
      MatIconModule,
      MatButtonModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule,
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
          auth: {
            token: {},
          },
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

  it('toggle drawer', () => {
    component['toggleOfferDrawer'].emit = jest.fn();

    component.drawerToggle();
    expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
  });
});
