import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailsLabelValueModule } from '../details-label-value';
import { CustomerComponent } from './customer.component';

describe('CustomerComponent', () => {
  let spectator: Spectator<CustomerComponent>;
  let component: CustomerComponent;

  const createComponent = createComponentFactory({
    component: CustomerComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(DetailsLabelValueModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
