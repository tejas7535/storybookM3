import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CancelCaseButtonComponent } from './cancel-case-button.component';

describe('CancelCaseButtonComponent', () => {
  let component: CancelCaseButtonComponent;
  let spectator: Spectator<CancelCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: CancelCaseButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
