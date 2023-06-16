import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../../assets/i18n/en.json';
import { BaseDialogComponent } from './base-dialog.component';

const initialState = {
  msd: {
    data: {
      ...initialDataState,
    },
    dialog: {
      ...initialDialogState,
      dialogOptions: {
        ...initialDialogState.dialogOptions,
        ratingsLoading: false,
      },
    },
  },
};

describe('BaseDialogComponent', () => {
  let component: BaseDialogComponent;
  let spectator: Spectator<BaseDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BaseDialogComponent,
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      MatButtonModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatGridListModule,
      MatIconModule,
      MatDialogModule,
      MatDividerModule,
      PushModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),

      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
    declarations: [BaseDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit minimize dialog event', () => {
    component.minimize.emit = jest.fn();
    component.minimizeDialog();
    expect(component.minimize.emit).toHaveBeenCalled();
  });
  it('should emit accept dialog event', () => {
    component.accept.emit = jest.fn();
    component.confirmDialog();
    expect(component.accept.emit).toHaveBeenCalled();
  });

  it('should emit close dialog event', () => {
    component.cancel.emit = jest.fn();
    component.cancelDialog();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
