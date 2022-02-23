import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../../testing/mocks';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CustomerHeaderComponent } from './customer-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerDetailsComponent', () => {
  let component: CustomerHeaderComponent;
  let spectator: Spectator<CustomerHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CustomerHeaderComponent,
    declarations: [CustomerHeaderComponent],
    imports: [
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
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
