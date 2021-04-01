import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomerComponent } from './customer.component';

describe('CustomerComponent', () => {
  let spectator: Spectator<CustomerComponent>;
  let component: CustomerComponent;

  const createComponent = createComponentFactory({
    component: CustomerComponent,
    imports: [provideTranslocoTestingModule({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
