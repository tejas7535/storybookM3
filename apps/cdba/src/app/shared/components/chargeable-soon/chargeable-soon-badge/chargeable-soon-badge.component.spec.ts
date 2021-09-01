import { MatDialog } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ChargeableSoonBadgeComponent } from './chargeable-soon-badge.component';

describe('ChargeableSoonBadgeComponent', () => {
  let component: ChargeableSoonBadgeComponent;
  let spectator: Spectator<ChargeableSoonBadgeComponent>;
  let chargeableSoonDialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: ChargeableSoonBadgeComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    chargeableSoonDialog = spectator.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should open chargeable soon dialog on button click',
    marbles(() => {
      component.onBadgeClick({ target: { blur: jest.fn() } });

      expect(chargeableSoonDialog.open).toHaveBeenCalled();
    })
  );
});
