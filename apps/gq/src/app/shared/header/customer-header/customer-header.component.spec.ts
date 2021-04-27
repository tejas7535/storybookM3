import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../';
import { CUSTOMER_MOCK } from '../../../../testing/mocks';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CustomerHeaderComponent } from './customer-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerDetailsComponent', () => {
  let component: CustomerHeaderComponent;
  let spectator: Spectator<CustomerHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CustomerHeaderComponent,
    declarations: [CustomerHeaderComponent],
    imports: [
      SharedModule,
      MatCardModule,
      MatButtonModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
    ],
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
