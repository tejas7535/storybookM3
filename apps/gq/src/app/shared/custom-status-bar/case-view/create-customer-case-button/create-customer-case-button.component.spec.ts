import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CreateCustomerCaseButtonComponent } from './create-customer-case-button.component';

describe('CreateCustomerCaseButtonComponent', () => {
  let component: CreateCustomerCaseButtonComponent;
  let spectator: Spectator<CreateCustomerCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: CreateCustomerCaseButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
