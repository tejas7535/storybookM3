import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { LoadCaseDataFormGroupModel } from '@ea/calculation/calculation-parameters/loadcase-data-form-group.interface';
import { ConfirmationDialogComponent } from '@ea/shared/confirmation-dialog/confirmation-dialog.component';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFormHelperService } from './calculation-parameters-form-helper.service';

describe('CalculationParametersFormHelperService', () => {
  let calculationParametersFormHelperService: CalculationParametersFormHelperService;
  let spectator: SpectatorService<CalculationParametersFormHelperService>;
  let translocoService: TranslocoService;
  let translocoServiceSpy: jest.SpyInstance;

  const createService = createServiceFactory({
    service: CalculationParametersFormHelperService,
    imports: [MatDialogModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      CalculationParametersFormHelperService,
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(() => ({}) as unknown as MatDialogRef<any>),
        },
      },
    ],
  });

  const createMockLoadCaseWithOperatingTime = (
    operatingTimeValue: number | undefined
  ): FormGroup<LoadCaseDataFormGroupModel> =>
    ({
      controls: {
        operatingTime: {
          value: operatingTimeValue,
        },
      },
    }) as unknown as FormGroup<LoadCaseDataFormGroupModel>;

  beforeEach(() => {
    spectator = createService();
    calculationParametersFormHelperService = spectator.service;
    translocoService = spectator.inject(TranslocoService);
    translocoServiceSpy = jest.spyOn(translocoService, 'translate');
  });

  it('should be created', () => {
    expect(calculationParametersFormHelperService).toBeDefined();
  });

  describe('getTotalOperatingTimeForLoadcases', () => {
    it('should provide value for empty loadcases', () => {
      const loadCases: FormGroup<LoadCaseDataFormGroupModel>[] = [];

      const result =
        calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases(
          loadCases
        );

      expect(result).toBe(0);
    });

    it('should provide total value for few loadcases', () => {
      const loadCases: FormGroup<LoadCaseDataFormGroupModel>[] = [
        createMockLoadCaseWithOperatingTime(20),
        createMockLoadCaseWithOperatingTime(50),
        createMockLoadCaseWithOperatingTime(undefined),
        createMockLoadCaseWithOperatingTime(25),
        createMockLoadCaseWithOperatingTime(25),
      ];

      const result =
        calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases(
          loadCases
        );
      expect(result).toBe(120);
    });
  });

  describe('getLocalizedLoadCaseName', () => {
    it('should get localized load case name', () => {
      const result =
        calculationParametersFormHelperService.getLocalizedLoadCaseName(2);

      expect(translocoServiceSpy).toHaveBeenCalledWith(
        'operationConditions.loadCaseName',
        {
          number: 2,
        }
      );

      expect('operationConditions.loadCaseName').toBe(result);
    });
  });

  describe('openConfirmDeleteDialog', () => {
    it('should open the dialog', () => {
      const mockRef =
        calculationParametersFormHelperService.openConfirmDeleteDialog();

      expect(mockRef).toEqual({} as unknown as MatDialogRef<any>);
      expect(
        calculationParametersFormHelperService['dialog'].open
      ).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        data: {
          cancelActionText:
            'operationConditions.confirmationDialog.cancelAction',
          confirmActionText:
            'operationConditions.confirmationDialog.confirmationAction',
          description: 'operationConditions.confirmationDialog.description',
          title: 'operationConditions.confirmationDialog.title',
        },
        width: '500px',
        autoFocus: false,
      });
    });
  });
});
