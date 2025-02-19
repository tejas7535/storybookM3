/* eslint-disable unicorn/no-null */
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { LoadCaseDataFormGroupModel } from '@ea/calculation/calculation-parameters/loadcase-data-form-group.interface';
import { ConfirmationDialogComponent } from '@ea/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CalculationParametersOperationConditions,
  LoadCaseData,
} from '../store/models';
import { CalculationParametersFormHelperService } from './calculation-parameters-form-helper.service';

describe('CalculationParametersFormHelperService', () => {
  let service: CalculationParametersFormHelperService;
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
    service = spectator.service;
    translocoService = spectator.inject(TranslocoService);
    translocoServiceSpy = jest.spyOn(translocoService, 'translate');
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('getTotalOperatingTimeForLoadcases', () => {
    it('should provide value for empty loadcases', () => {
      const loadCases: FormGroup<LoadCaseDataFormGroupModel>[] = [];

      const result = service.getTotalOperatingTimeForLoadcases(loadCases);

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

      const result = service.getTotalOperatingTimeForLoadcases(loadCases);
      expect(result).toBe(120);
    });
  });

  describe('getLocalizedLoadCaseName', () => {
    it('should get localized load case name', () => {
      const result = service.getLocalizedLoadCaseName(2);

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
      const mockRef = service.openConfirmDeleteDialog();

      expect(mockRef).toEqual({} as unknown as MatDialogRef<any>);
      expect(service['dialog'].open).toHaveBeenCalledWith(
        ConfirmationDialogComponent,
        {
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
        }
      );
    });
  });

  describe('getLocalizedLoadCaseTimePortion', () => {
    describe('when operatingTimeInHours and loadcasePercentage are not provided', () => {
      it('should return empty string', () => {
        const result = service.getLocalizedLoadCaseTimePortion(
          undefined,
          undefined
        );

        expect(result).toBe('');
      });
    });

    describe('when operatingTimeInHours and loadcasePercentage are provided', () => {
      it('should return localized load case time portion', () => {
        const operatingTimeInHours = 100;
        const loadcasePercentage = 25;
        const expectedLoadcaseTime = 25;
        const expectedTranslation = 'operationConditions.loadCaseTimePortion';

        const result = spectator.service.getLocalizedLoadCaseTimePortion(
          operatingTimeInHours,
          loadcasePercentage
        );

        expect(translocoServiceSpy).toHaveBeenCalledWith(
          'operationConditions.loadCaseTimePortion',
          {
            loadcasePercentage,
            totalTime: operatingTimeInHours,
            loadcaseTime: expectedLoadcaseTime,
          }
        );
        expect(result).toBe(expectedTranslation);
      });
    });

    describe('when updating result to handle negative values', () => {
      it('should replace null values with undefined', () => {
        const previousInput: Partial<CalculationParametersOperationConditions> =
          {
            ambientTemperature: undefined,
            time: undefined,
            loadCaseData: [{ operatingTemperature: undefined } as LoadCaseData],
          };

        const newInput: Partial<CalculationParametersOperationConditions> = {
          ambientTemperature: null,
          time: null,
          loadCaseData: [{ operatingTemperature: null } as LoadCaseData],
        };

        const result = service.updateResultsToHandleNegativeValues(
          previousInput,
          newInput
        );
        expect(result).toMatchSnapshot();
      });

      it('should not change non-null values', () => {
        const previousInput = {
          ambientTemperature: 25,
          time: 123,
          loadCaseData: [{ operatingTemperature: 20 } as LoadCaseData],
        };

        const newInput = {
          ambientTemperature: 25,
          time: 123,
          loadCaseData: [{ operatingTemperature: 20 } as LoadCaseData],
        };

        const result = service.updateResultsToHandleNegativeValues(
          previousInput,
          newInput
        );
        expect(result).toMatchSnapshot();
      });

      describe('when new input is null with minus sign scenario', () => {
        it('should set previous value to undefined to block change detection', () => {
          const previousInput = {
            ambientTemperature: 25,
            time: 123,
            loadCaseData: [{ operatingTemperature: 20 } as LoadCaseData],
          };

          const newInput: Partial<CalculationParametersOperationConditions> = {
            ambientTemperature: null,
            time: 123,
            loadCaseData: [{ operatingTemperature: null } as LoadCaseData],
          };

          const result = service.updateResultsToHandleNegativeValues(
            previousInput,
            newInput
          );
          expect(result).toMatchSnapshot();
        });
      });
    });
  });
});
