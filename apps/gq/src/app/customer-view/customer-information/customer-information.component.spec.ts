import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { CustomerInformationComponent } from './customer-information.component';

describe('CustomerDetailsComponent', () => {
  let component: CustomerInformationComponent;
  let spectator: Spectator<CustomerInformationComponent>;

  const createComponent = createComponentFactory({
    component: CustomerInformationComponent,
    detectChanges: false,
    imports: [MatCardModule, provideTranslocoTestingModule({})],
    declarations: [CustomerInformationComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.customer = CUSTOMER_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
