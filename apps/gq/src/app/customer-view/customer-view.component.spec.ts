import { ComponentFixture } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewComponent } from './customer-view.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerViewComponent', () => {
  let component: CustomerViewComponent;
  let spectator: Spectator<CustomerViewComponent>;
  let fixture: ComponentFixture<CustomerViewComponent>;

  const createComponent = createComponentFactory({
    component: CustomerViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CustomerInformationModule,
      MatCardModule,
      MatSidenavModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
      RouterTestingModule,
      BreadcrumbsModule,
      SubheaderModule,
      ShareButtonModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(ApplicationInsightsService),
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
    fixture = spectator.fixture;
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
      fixture.detectChanges();
      expect(component['subscription'].add).toHaveBeenCalledTimes(2);

      component.addGetSelectedQuotationDetailItemIdSubscription();

      expect(component['subscription'].add).toHaveBeenCalledTimes(3);
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
