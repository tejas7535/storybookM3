import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { Quotation } from '@gq/shared/models';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { QUOTATION_DETAIL_MOCK } from '../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { SapViewComponent } from './sap-view.component';

describe('SapViewComponent', () => {
  let component: SapViewComponent;
  let spectator: Spectator<SapViewComponent>;
  const breadcrumbs = [{ label: '' }];

  const createComponent = createComponentFactory({
    component: SapViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideMockStore({}),
      MockProvider(ActiveCaseFacade, {
        quotationCustomer$: of(CUSTOMER_MOCK),
        quotation$: of({ caseName: 'test', gqId: 12_345 } as Quotation),
        quotationCurrency$: of('EUR'),
        selectedQuotationDetail$: of(QUOTATION_DETAIL_MOCK),
        quotationLoading$: of(false),
        sapPriceDetailsLoading$: of(false),
        detailViewQueryParams$: of({ id: 1, queryParams: {} } as any),
        sapPriceDetails$: of([]),
      }),
      MockProvider(BreadcrumbsService, {
        getPriceDetailBreadcrumbs: jest.fn(() => breadcrumbs),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        component['translocoService'].selectTranslateObject = jest.fn(
          () => new BehaviorSubject({ test: 'test' }) as any
        );

        m.expect(component.customer$).toBeObservable(
          m.cold('(a|)', { a: CUSTOMER_MOCK })
        );
        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('(a|)', { a: QUOTATION_DETAIL_MOCK })
        );
        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
        m.expect(component.sapPriceDetailsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
        m.expect(component.rowData$).toBeObservable(m.cold('(a|)', { a: [] }));
        m.expect(component.quotation$).toBeObservable(
          m.cold('(a|)', {
            a: { caseName: 'test', gqId: 12_345 } as Quotation,
          })
        );
        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('(a|)', { a: breadcrumbs })
        );
        m.expect(component.translationsLoaded$).toBeObservable(
          m.cold('a', {
            a: false,
          })
        );
      })
    );
  });
});
