import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../../../../../testing/mocks/models/quotation';
import { StatusBarModalComponent } from './status-bar-modal.component';

describe('StatusBarModalComponent', () => {
  let component: StatusBarModalComponent;
  let spectator: Spectator<StatusBarModalComponent>;

  const createComponent = createComponentFactory({
    component: StatusBarModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      SharedPipesModule,
      DialogHeaderModule,
      HorizontalDividerModule,
      MockDirective(DragDialogDirective),
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
        useValue: { filteredAmount: 1 },
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
