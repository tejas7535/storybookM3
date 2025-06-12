import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IpExposureComponent } from './ip-exposure.component';

describe('IpExposureComponent', () => {
  let component: IpExposureComponent;
  let spectator: Spectator<IpExposureComponent>;

  const createComponent = createComponentFactory({
    component: IpExposureComponent,
    imports: [MatButtonModule, provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: MatDialogRef, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    test('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
