import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { CustomerDetailsModule } from '../../shared/process-case-header/customer-details.component/customer-details.module';
import { OfferHeaderComponent } from './offer-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferHeaderComponent', () => {
  let component: OfferHeaderComponent;
  let router: Router;
  let spectator: Spectator<OfferHeaderComponent>;

  const createComponent = createComponentFactory({
    component: OfferHeaderComponent,
    declarations: [OfferHeaderComponent],
    imports: [
      MatIconModule,
      provideTranslocoTestingModule({}),
      CustomerDetailsModule,
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            customer: {
              item: CUSTOMER_MOCK,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = TestBed.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('backToProcessCase', () => {
    router.navigate = jest.fn();

    component.backToProcessCase();
    expect(router.navigate).toHaveBeenCalled();
  });
});
