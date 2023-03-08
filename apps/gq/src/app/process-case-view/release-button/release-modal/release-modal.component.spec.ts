import { MatDialogRef } from '@angular/material/dialog';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReleaseModalComponent } from './release-modal.component';

describe('ReleaseModalComponent', () => {
  let component: ReleaseModalComponent;
  let spectator: Spectator<ReleaseModalComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseModalComponent,
    imports: [DialogHeaderModule, provideTranslocoTestingModule({})],
    providers: [{ provide: MatDialogRef, useValue: {} }],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
