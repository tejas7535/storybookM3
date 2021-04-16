import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DeleteAcceptComponent } from './delete-accept.component';

describe('DeleteAcceptComponent', () => {
  let component: DeleteAcceptComponent;
  let spectator: Spectator<DeleteAcceptComponent>;

  const createComponent = createComponentFactory({
    component: DeleteAcceptComponent,
    imports: [MatDialogModule, provideTranslocoTestingModule({})],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
    declarations: [DeleteAcceptComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onCancelClick', () => {
    test('should close dialogRef', () => {
      component.dialogRef.close = jest.fn();

      component.onCancelClick();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
