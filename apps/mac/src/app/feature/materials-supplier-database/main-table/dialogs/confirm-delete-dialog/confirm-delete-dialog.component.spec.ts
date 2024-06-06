import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataFacade } from '@mac/msd/store/facades/data';

import * as en from '../../../../../../assets/i18n/en.json';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

describe('ConfirmDeleteDialogComponent', () => {
  let component: ConfirmDeleteDialogComponent;
  let spectator: Spectator<ConfirmDeleteDialogComponent>;

  const createComponent = createComponentFactory({
    component: ConfirmDeleteDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      provideMockStore({}),
      {
        provide: DataFacade,
        useValue: {
          navigation$: of({
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
          }),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closeDialog should close dialog', () => {
    component.dialogRef.close = jest.fn();
    component.closeDialog();

    expect(component.dialogRef.close).toBeCalledWith(false);
  });

  describe('applyDialog', () => {
    it('should close dialog and set data for delete', () => {
      component.dialogRef.close = jest.fn();
      component.applyDialog();

      expect(component.dialogRef.close).toBeCalledWith(true);
    });
  });
});
