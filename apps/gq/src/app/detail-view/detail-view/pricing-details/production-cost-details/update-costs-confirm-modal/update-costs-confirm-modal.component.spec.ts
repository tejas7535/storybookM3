/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UpdateCostsConfirmModalComponent } from './update-costs-confirm-modal.component';

describe('UpdateCostsConfirmModalComponent', () => {
  let component: UpdateCostsConfirmModalComponent;
  let spectator: Spectator<UpdateCostsConfirmModalComponent>;

  const createComponent = createComponentFactory({
    component: UpdateCostsConfirmModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [
      { provide: MatDialog, useValue: {} },
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { gqpPosId: '123' },
      },
      MockProvider(ActiveCaseFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirm', () => {
    test('should call updateCosts', () => {
      const updateCostsMock = jest.fn();
      component['activeCaseFacade'].updateCosts = updateCostsMock;
      component['activeCaseFacade'].updateCostsSuccess$ = of();

      component.confirm();

      expect(updateCostsMock).toHaveBeenCalledTimes(1);
    });
    test('should close dialog when updateCostsSuccess$ emits', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      const facadeMock: ActiveCaseFacade = {
        updateCostsSuccess$: of(true),
        updateCosts: jest.fn(),
      } as unknown as ActiveCaseFacade;

      Object.defineProperty(component, 'activeCaseFacade', {
        value: facadeMock,
      });

      component.confirm();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeDialog', () => {
    test('Should close dialog', () => {
      const closeDialogMock = jest.fn();
      component['dialogRef'].close = closeDialogMock;

      component.closeDialog();

      expect(closeDialogMock).toHaveBeenCalledTimes(1);
    });
  });
});
