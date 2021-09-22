import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ChargeableSoonConfirmationComponent } from './chargeable-soon-confirmation.component';

describe('ChargeableSoonConfirmationComponent', () => {
  let component: ChargeableSoonConfirmationComponent;
  let spectator: Spectator<ChargeableSoonConfirmationComponent>;

  const createComponent = createComponentFactory({
    component: ChargeableSoonConfirmationComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
