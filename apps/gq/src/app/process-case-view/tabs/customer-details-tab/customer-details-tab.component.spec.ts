import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { CustomerDetailsTabComponent } from './customer-details-tab.component';

describe('CustomerDetailsTabComponent', () => {
  let component: CustomerDetailsTabComponent;
  let spectator: Spectator<CustomerDetailsTabComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CustomerDetailsTabComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          activeCase: ACTIVE_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set customer$',
      marbles((m) => {
        store.overrideSelector(activeCaseFeature.selectCustomer, CUSTOMER_MOCK);

        component.ngOnInit();

        m.expect(component.customer$).toBeObservable(
          m.cold('a', { a: CUSTOMER_MOCK })
        );
      })
    );
  });
});
