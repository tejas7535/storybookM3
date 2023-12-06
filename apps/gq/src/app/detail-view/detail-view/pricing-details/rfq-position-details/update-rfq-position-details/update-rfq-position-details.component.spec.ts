import { UpdateRfqPositionDetailsComponent } from './update-rfq-position-details.component';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MockProvider } from 'ng-mocks';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UpdateRfqPositionDetailsComponent', () => {
  let component: UpdateRfqPositionDetailsComponent;
  let spectator: Spectator<UpdateRfqPositionDetailsComponent>;

  const createComponent = createComponentFactory({
    component: UpdateRfqPositionDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [
      { provide: MatDialog, useValue: {} },
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { gqpPositionId: '123' },
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
    test('should call updateRfqInformation', () => {
      const updateRfqInformationMock = jest.fn();
      component['activeCaseFacade'].updateRfqInformation =
        updateRfqInformationMock;
      component['activeCaseFacade'].updateRfqInformationSuccess$ = of();

      component.confirm();

      expect(updateRfqInformationMock).toBeCalledTimes(1);
    });
    test('should close dialog when updateRfqInformationSuccess$ emits', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      const facadeMock: ActiveCaseFacade = {
        updateRfqInformationSuccess$: of(true),
        updateRfqInformation: jest.fn(),
      } as unknown as ActiveCaseFacade;

      Object.defineProperty(component, 'activeCaseFacade', {
        value: facadeMock,
      });

      component.confirm();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeDialog', () => {
    test('should close dialog', () => {
      const closeDialogMock = jest.fn();
      component['dialogRef'].close = closeDialogMock;

      component.closeDialog();

      expect(closeDialogMock).toBeCalledTimes(1);
    });
  });
});
