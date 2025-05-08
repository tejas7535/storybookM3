import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { CustomerSubheaderContentComponent } from './customer-subheader-content.component';

describe('CustomerSubheaderContentComponent', () => {
  let component: CustomerSubheaderContentComponent;
  let spectator: Spectator<CustomerSubheaderContentComponent>;

  const createComponent = createComponentFactory({
    component: CustomerSubheaderContentComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { displaySalesOrg: true, customer: CUSTOMER_MOCK },
    });
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
