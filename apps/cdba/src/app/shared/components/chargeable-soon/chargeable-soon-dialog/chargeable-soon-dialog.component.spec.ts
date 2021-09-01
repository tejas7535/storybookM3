import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ChargeableSoonDialogComponent } from './chargeable-soon-dialog.component';

describe('ChargeableSoonDialogComponent', () => {
  let component: ChargeableSoonDialogComponent;
  let spectator: Spectator<ChargeableSoonDialogComponent>;
  let chargeableSoonConfirmation: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: ChargeableSoonDialogComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    chargeableSoonConfirmation = spectator.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should open confirmation dialog on button click',
    marbles(() => {
      component.onSecondaryActionClick();

      expect(chargeableSoonConfirmation.open).toHaveBeenCalled();
    })
  );
});
