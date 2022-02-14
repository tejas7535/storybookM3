import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { StatusBar } from '../../models';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { HorizontalDividerModule } from '../horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../label-text/label-text.module';
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
      ReactiveComponentModule,
      SharedPipesModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
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
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
