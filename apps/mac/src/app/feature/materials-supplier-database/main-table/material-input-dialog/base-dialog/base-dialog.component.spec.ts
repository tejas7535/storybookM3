import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';

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
    imports: [MockPipe(PushPipe), provideTranslocoTestingModule({ en })],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
