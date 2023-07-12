import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { StatusBar } from '@gq/shared/models/status-bar.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { StatusBarModalComponent } from './status-bar-modal.component';

describe('StatusBarModalComponent', () => {
  let component: StatusBarModalComponent;
  let spectator: Spectator<StatusBarModalComponent>;

  const createComponent = createComponentFactory({
    component: StatusBarModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),

      PushModule,
      SharedPipesModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
      {
        provide: TransformationService,
        useValue: {
          transformNumberCurrency: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: new StatusBar(),
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.showGPI$).toBeObservable('a', {
          a: true,
        });
        m.expect(component.showGPM$).toBeObservable('a', {
          a: true,
        });
      })
    );
  });

  describe('closeDialog', () => {
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
