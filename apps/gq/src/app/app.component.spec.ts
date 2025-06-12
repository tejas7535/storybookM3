import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';

import { BehaviorSubject, from, of, ReplaySubject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MaintenanceModule } from '@schaeffler/empty-states';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK, HEALTH_CHECK_STATE_MOCK } from '../testing/mocks';
import { AppComponent } from './app.component';
import { AppRoutePath } from './app-route-path.enum';
import { AppRoutingModule } from './app-routing.module';
import { ActiveCaseFacade } from './core/store/active-case/active-case.facade';
import { QuotationIdentifier } from './core/store/active-case/models';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';
import { GlobalSearchBarModule } from './shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import { Customer } from './shared/models/customer/customer.model';
import { Quotation } from './shared/models/quotation/quotation.model';
import { UserSettingsService } from './shared/services/rest/user-settings/user-settings.service';

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: `legal/foo`,
};

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;
  const quotationCustomerSubject$$: BehaviorSubject<Customer> =
    new BehaviorSubject<Customer>({} as Customer);
  const quotationLoadingSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const quotationIdentifierSubject$$: BehaviorSubject<QuotationIdentifier> =
    new BehaviorSubject<QuotationIdentifier>({} as QuotationIdentifier);

  const quotationSubject$$: BehaviorSubject<Quotation> =
    new BehaviorSubject<Quotation>({} as Quotation);

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      AppShellModule,
      LoadingSpinnerModule,
      MockComponent(UserSettingsComponent),
      MaintenanceModule,
      AppRoutingModule,
      GlobalSearchBarModule,
    ],
    providers: [
      { provide: MatDialog, useValue: {} },
      mockProvider(ActiveCaseFacade, {
        quotationCustomer$: quotationCustomerSubject$$.asObservable(),
        quotationLoading$: quotationLoadingSubject$$.asObservable(),
        quotationIdentifier$: quotationIdentifierSubject$$.asObservable(),
        quotation$: quotationSubject$$.asObservable(),
      }),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          healthCheck: HEALTH_CHECK_STATE_MOCK,
        },
      }),

      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            url: [{ path: `/${LegalPath.ImprintPath}` }],
          },
        },
      },
      mockProvider(UserSettingsService, {
        updateUserSettings: jest.fn(),
      }),
      mockProvider(HealthCheckFacade),
      mockProvider(ApplicationInsightsService),
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('handleBeforeUnload', () => {
    test('should call the method', () => {
      component.handleBeforeUnload();
      expect(
        component['userSettingsService'].updateUserSettingsAsPromise
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();
      component.handleCurrentRoute = jest.fn();
      component['handleIpExposureDialog'] = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.handleCurrentRoute).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCurrentRoute', () => {
    test(
      'should set showGlobalSearch$ to true when url starts with /case-view',
      marbles((m) => {
        // Arrange
        const url = '/case-view/123';
        routerMock.url = url;
        // Simulate NavigationEnd event
        const navigationEnd = {
          url,
          instanceof: () => true,
        } as unknown as NavigationEnd;
        eventSubject.next(navigationEnd);

        // Act
        component.handleCurrentRoute();

        // Assert
        const expected$ = m.cold('(a)', { a: true });
        m.expect(component.showGlobalSearch$).toBeObservable(expected$);
      })
    );

    test(
      'should set showGlobalSearch$ to false when url does not start with /case-view',
      marbles((m) => {
        // Arrange
        const url = '/other-route';
        routerMock.url = url;
        // Simulate NavigationEnd event
        const navigationEnd = {
          url,
          instanceof: () => true,
        } as unknown as NavigationEnd;
        eventSubject.next(navigationEnd);

        // Act
        component.handleCurrentRoute();

        // Assert
        const expected$ = m.cold('(a)', { a: false });
        m.expect(component.showGlobalSearch$).toBeObservable(expected$);
      })
    );
  });

  describe('handleIpExposureDialog', () => {
    beforeEach(() => {
      component['dialog'].open = jest.fn();
    });
    afterEach(() => {
      (component['dialog'].open as jest.Mock).mockClear();
      jest.resetAllMocks();
    });
    describe('filter route and load customer/quotationData', () => {
      test(
        'should not open when route is no route to show ipExposure dialog',
        marbles((m) => {
          store.select = jest
            .fn()
            .mockReturnValue(
              from([
                AppRoutePath.DetailViewPath,
                AppRoutePath.ProcessCaseViewPath,
              ])
            );
          component['shouldOpenIpExposureDialog'] = jest
            .fn()
            .mockReturnValue(false);
          component['waitUntilQuotationCustomerLoaded'] = jest.fn();
          component['openIpExposureDialog'] = jest.fn();
          component['handleIpExposureDialog']();
          m.flush();
          expect(component['shouldOpenIpExposureDialog']).toHaveBeenCalled();
          expect(
            component['waitUntilQuotationCustomerLoaded']
          ).not.toHaveBeenCalled();
          expect(component['openIpExposureDialog']).not.toHaveBeenCalled();
        })
      );
      test(
        'should open the dialog when route is okay and data is completely loaded',
        marbles((m) => {
          store.select = jest
            .fn()
            .mockReturnValue(
              from([undefined, AppRoutePath.ProcessCaseViewPath])
            );
          component['shouldOpenIpExposureDialog'] = jest
            .fn()
            .mockReturnValue(true);
          component['waitUntilQuotationCustomerLoaded'] = jest
            .fn()
            .mockReturnValue(of({ showIpExposure: true } as Customer));
          component['openIpExposureDialog'] = jest.fn();
          component['handleIpExposureDialog']();
          m.flush();
          expect(component['shouldOpenIpExposureDialog']).toHaveBeenCalled();
          expect(
            component['waitUntilQuotationCustomerLoaded']
          ).toHaveBeenCalled();
          expect(component['openIpExposureDialog']).toHaveBeenCalled();
        })
      );

      describe('shouldOpenIpExposureDialog', () => {
        test('should return false when previous route is DetailView and current route is ProcessCaseView', () => {
          const result = component['shouldOpenIpExposureDialog']([
            AppRoutePath.DetailViewPath,
            AppRoutePath.ProcessCaseViewPath,
          ]);
          expect(result).toBe(false);
        });
        test('should return false when previous route is ProcessCaseView and current route is DetailView', () => {
          const result = component['shouldOpenIpExposureDialog']([
            AppRoutePath.ProcessCaseViewPath,
            AppRoutePath.DetailViewPath,
          ]);
          expect(result).toBe(false);
        });
        test('should return true when previous route is CaseView and current route is ProcessCaseView', () => {
          const result = component['shouldOpenIpExposureDialog']([
            AppRoutePath.CaseViewPath,
            AppRoutePath.ProcessCaseViewPath,
          ]);
          expect(result).toBe(true);
        });
        test('should return true when first has been undefined and current route is ProcessCaseView', () => {
          const result = component['shouldOpenIpExposureDialog']([
            undefined,
            AppRoutePath.ProcessCaseViewPath,
          ]);
          expect(result).toBe(true);
        });
        test('should return true when first has been undefined and current route is DetailView', () => {
          const result = component['shouldOpenIpExposureDialog']([
            undefined,
            AppRoutePath.DetailViewPath,
          ]);
          expect(result).toBe(true);
        });
      });

      describe('waitUntilQuotationCustomerLoaded', () => {
        test(
          'should emit when quotation and QuotationCustomer have data, and identifier from queryParams match identifier',
          marbles((m) => {
            const queryParams: any = {
              customer_number: '123',
              quotation_number: '456',
            };

            store.select = jest.fn().mockReturnValue(of(queryParams));
            const mockCustomer: Customer = {
              identifier: { customerId: '123', salesOrg: '0815' },
              showIpExposure: true,
            } as Customer;
            const mockQuotation: Quotation = { gqId: 456 } as Quotation;
            const mockIdentifier: QuotationIdentifier = {
              gqId: 456,
              customerNumber: '123',
              salesOrg: '0815',
            };

            quotationCustomerSubject$$.next(mockCustomer);
            quotationLoadingSubject$$.next(false);
            quotationIdentifierSubject$$.next(mockIdentifier);
            quotationSubject$$.next(mockQuotation);
            const result = component['waitUntilQuotationCustomerLoaded']();
            m.expect(result).toBeObservable(
              m.cold('(a|)', { a: mockCustomer })
            );
          })
        );
        test(
          'should not emit when quotation is loading',
          marbles((m) => {
            store.select = jest.fn().mockReturnValue(of({}));
            quotationCustomerSubject$$.next({} as Customer);
            quotationSubject$$.next({} as Quotation);
            quotationIdentifierSubject$$.next({} as QuotationIdentifier);

            quotationLoadingSubject$$.next(true);
            const result = component['waitUntilQuotationCustomerLoaded']();
            m.expect(result).toBeObservable(
              m.cold('()') // No emission expected
            );
          })
        );

        test(
          'should not emit when quotationCustomer is undefined',
          marbles((m) => {
            store.select = jest.fn().mockReturnValue(of({}));
            quotationLoadingSubject$$.next(false);
            quotationSubject$$.next({} as Quotation);
            quotationIdentifierSubject$$.next({} as QuotationIdentifier);

            quotationCustomerSubject$$.next(undefined as Customer);

            const result = component['waitUntilQuotationCustomerLoaded']();

            m.expect(result).toBeObservable(
              m.cold('()') // No emission expected
            );
          })
        );
        test(
          'should not emit when quotation is undefined',
          marbles((m) => {
            store.select = jest.fn().mockReturnValue(of({}));
            quotationLoadingSubject$$.next(false);
            quotationCustomerSubject$$.next({} as Customer);
            quotationIdentifierSubject$$.next({} as QuotationIdentifier);

            quotationSubject$$.next(undefined as Quotation);
            const result = component['waitUntilQuotationCustomerLoaded']();

            m.expect(result).toBeObservable(
              m.cold('()') // No emission expected
            );
          })
        );

        test(
          'should not emit when quotationIdentifier is undefined',
          marbles((m) => {
            store.select = jest.fn().mockReturnValue(of({}));
            quotationLoadingSubject$$.next(false);
            quotationSubject$$.next({} as Quotation);
            quotationCustomerSubject$$.next({} as Customer);

            quotationIdentifierSubject$$.next(undefined as QuotationIdentifier);
            quotationSubject$$.next(undefined as Quotation);
            const result = component['waitUntilQuotationCustomerLoaded']();

            m.expect(result).toBeObservable(
              m.cold('()') // No emission expected
            );
          })
        );
      });

      describe('openIpExposureDialog', () => {
        test('should open dialog when customer has showIpExposure true', () => {
          const mockCustomer: Customer = {
            showIpExposure: true,
          } as Customer;
          component['openIpExposureDialog'](mockCustomer);
          expect(component['dialog'].open).toHaveBeenCalled();
        });

        test('should not open dialog when customer has showIpExposure false', () => {
          const mockCustomer: Customer = {
            showIpExposure: false,
          } as Customer;
          component['openIpExposureDialog'](mockCustomer);
          expect(component['dialog'].open).not.toHaveBeenCalled();
        });
      });
    });
  });
});
