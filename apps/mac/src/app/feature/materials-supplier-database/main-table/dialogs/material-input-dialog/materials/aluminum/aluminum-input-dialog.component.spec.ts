import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { assignDialogValues } from '@mac/testing/mocks/msd/mock-input-dialog-values.mocks';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { DialogControlsService } from '../../services';
import { AluminumInputDialogComponent } from './aluminum-input-dialog.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

@Injectable()
class MockDialogFacade extends DialogFacade {
  updateCreateMaterialDialogValues = jest.fn();
  materialDialogConfirmed = jest.fn();
}

describe('AluminumInputDialogComponent', () => {
  let component: AluminumInputDialogComponent;
  let spectator: Spectator<AluminumInputDialogComponent>;
  let dialogFacade: DialogFacade;

  const initialState = {
    msd: {
      data: {
        ...initialDataState,
      },
      dialog: {
        ...initialDialogState,
        dialogOptions: {
          ...initialDialogState.dialogOptions,
          materialStandards: mockMaterialStandards,
          materialStandardsLoading: true,
          manufacturerSuppliers: mockSuppliers,
          manufacturerSuppliersLoading: true,
          ratings: ['1'],
          ratingsLoading: true,
          steelMakingProcesses: ['1'],
          steelMakingProcessesLoading: true,
          co2Classifications: ['1'],
          co2ClassificationsLoading: true,
          castingModes: ['1'],
          castingModesLoading: true,
          loading: true,
        },
        createMaterial: {
          ...initialDialogState.createMaterial,
          createMaterialLoading: true,
          createMaterialSuccess: true,
        },
      },
    },
  };

  const createComponent = createComponentFactory({
    component: AluminumInputDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(SelectModule),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),

      MockProvider(DialogControlsService, {
        getNumberControl: jest.fn(
          (_, disabled) => new FormControl({ value: undefined, disabled })
        ),
      }),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    assignDialogValues(component);

    spectator.detectChanges();

    dialogFacade = spectator.inject(DialogFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign the material form', () => {
      component.createMaterialForm = undefined;

      component.ngOnInit();

      expect(component.createMaterialForm).toBeTruthy();
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    it('should assign the material form', () => {
      component.co2Scope1Control.setValue(99);

      expect(
        dialogFacade.updateCreateMaterialDialogValues
      ).toHaveBeenCalledWith(component.createMaterialForm.value);
    });
  });
});
