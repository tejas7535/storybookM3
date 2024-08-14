import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../../testing/mocks';
import { CustomerDetailsTabComponent } from './customer-details-tab.component';

describe('CustomerDetailsTabComponent', () => {
  let component: CustomerDetailsTabComponent;
  let spectator: Spectator<CustomerDetailsTabComponent>;

  const createComponent = createComponentFactory({
    component: CustomerDetailsTabComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({}),
      MockProvider(ActiveCaseFacade, {
        quotationCustomer$: of({ ...CUSTOMER_MOCK }),
      }),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$: of(true),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
