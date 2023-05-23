import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../../testing/mocks/state/active-case-state.mock';
import { StatusBar } from '../../../models';
import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { TransformationService } from '../../../services/transformation/transformation.service';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '../../horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../label-text/label-text.module';
import { StatusBarModalComponent } from './status-bar-modal.component';

describe('StatusBarModalComponent', () => {
  let component: StatusBarModalComponent;
  let spectator: Spectator<StatusBarModalComponent>;

  const createComponent = createComponentFactory({
    component: StatusBarModalComponent,
    imports: [
      DialogHeaderModule,
      provideTranslocoTestingModule({ en: {} }),
      HorizontalDividerModule,
      LabelTextModule,
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
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: new StatusBar(),
      },
      {
        provide: TransformationService,
        useValue: {
          transformMarginDetails: jest.fn(),
          transformPercentage: jest.fn(),
        },
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
