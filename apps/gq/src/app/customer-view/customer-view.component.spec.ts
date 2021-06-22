import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewComponent } from './customer-view.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerViewComponent', () => {
  let component: CustomerViewComponent;
  let spectator: Spectator<CustomerViewComponent>;

  const createComponent = createComponentFactory({
    component: CustomerViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CaseHeaderModule,
      CustomerInformationModule,
      MatCardModule,
      MatSidenavModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
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
        },
      }),
    ],
    declarations: [CustomerViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should define observables', () => {
      component.ngOnInit();

      expect(component.customer$).toBeDefined();
    });

    test('should call add subscriptions', () => {
      component.addSubscriptions = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSubscriptions', () => {
    test('should call methods to add subscriptions', () => {
      component.addQueryParamsSubscription = jest.fn();
      component.addGetSelectedQuotationDetailItemIdSubscription = jest.fn();

      component.addSubscriptions();

      expect(
        component.addGetSelectedQuotationDetailItemIdSubscription
      ).toHaveBeenCalledTimes(1);
      expect(component.addQueryParamsSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('addQueryParamsSubscription', () => {
    test('should addQueryParamsSubscription', () => {
      component['subscription'].add = jest.fn();

      component.addQueryParamsSubscription();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });
  describe('addGetSelectedQuotationDetailItemIdSubscription', () => {
    test('should addGetSelectedQuotationDetailItemIdSubscription', () => {
      component['subscription'].add = jest.fn();
      component.params = {} as any;

      component.addGetSelectedQuotationDetailItemIdSubscription();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe subscription', () => {
      component['subscription'].unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
