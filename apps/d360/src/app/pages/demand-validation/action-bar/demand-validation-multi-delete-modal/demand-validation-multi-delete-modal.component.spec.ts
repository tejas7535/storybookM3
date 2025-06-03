import { of, throwError } from 'rxjs';

import { MessageType } from '../../../../shared/models/message-type.enum';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationMultiDeleteModalComponent } from './demand-validation-multi-delete-modal.component';

describe('DemandValidationMultiDeleteModalComponent', () => {
  let component: DemandValidationMultiDeleteModalComponent;
  const onSaveMock = jest.fn();

  let dialogSpy: jest.SpyInstance;
  let dialogRefSpy: jest.SpyInstance;

  beforeEach(() => {
    component = Stub.get<DemandValidationMultiDeleteModalComponent>({
      component: DemandValidationMultiDeleteModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          customerName: 'BMW',
          customerNumber: '0000042',
          onSave: onSaveMock,
        }),
        Stub.getMatDialogProvider(),
        Stub.getDemandValidationServiceProvider(),
      ],
    });

    dialogSpy = jest.spyOn(component['dialog'], 'open');
    dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should validate form as valid when material numbers are selected', () => {
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
      ]);
      expect(component['isFormInvalid']()).toBe(false);
    });

    it('should validate dates and return errors when end date is before start date', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      component['formGroup'].controls.startDate.setValue(today);
      component['formGroup'].controls.endDate.setValue(yesterday);

      expect(component['formGroup'].invalid).toBe(true);
    });
  });

  describe('onClose', () => {
    it('should close the dialog when onClose is called', () => {
      component['onClose']();
      expect(dialogRefSpy).toHaveBeenCalled();
    });
  });

  describe('deleteOnConfirmation', () => {
    it('should show error message when trying to delete with no materials selected', () => {
      component['formGroup'].controls.materialNumbers.setValue([]);
      component['deleteOnConfirmation']();

      expect(component['snackbarService'].openSnackBar).toHaveBeenCalled();
      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog when form is valid', () => {
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
      ]);
      component['deleteOnConfirmation']();

      expect(dialogSpy).toHaveBeenCalled();
    });
  });

  describe('deleteDemandBatch', () => {
    beforeEach(() => {
      // Setup valid form data for testing
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
        { id: '67890', text: 'Material 2' },
      ]);

      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 11, 31);

      component['formGroup'].controls.startDate.setValue(startDate);
      component['formGroup'].controls.endDate.setValue(endDate);
      component['formGroup'].controls.periodType.setValue({
        id: DateRangePeriod.Monthly,
        text: 'Monthly',
      });
    });

    it('should call demandValidationService with correct parameters for monthly periods', () => {
      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(of({} as any));

      component['deleteDemandBatch']().subscribe();

      expect(
        component['demandValidationService'].deleteValidatedDemandBatch
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          customerNumber: '0000042',
          materialNumbers: ['12345', '67890'],
          fromDate: expect.any(String),
          toDate: expect.any(String),
        }),
        false
      );
    });

    it('should format dates properly for weekly periods', () => {
      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(of({} as any));

      component['formGroup'].controls.periodType.setValue({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });
      component['deleteDemandBatch']().subscribe();

      expect(
        component['demandValidationService'].deleteValidatedDemandBatch
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          fromDate: expect.any(String),
          toDate: expect.any(String),
        }),
        false
      );
    });

    it('should show success message and close dialog on successful deletion', () => {
      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(
          of({
            result: { messageType: MessageType.Success },
            results: [],
          }) as any
        );
      component['deleteDemandBatch']().subscribe();

      expect(component['snackbarService'].openSnackBar).toHaveBeenCalled();
      expect(onSaveMock).toHaveBeenCalled();
      expect(dialogRefSpy).toHaveBeenCalled();
    });

    it('should show error messages for materials with errors', () => {
      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(
          of({
            result: { messageType: MessageType.Success },
            results: [
              {
                materialNumber: '12345',
                result: {
                  messageType: MessageType.Error,
                  messages: ['Error 1'],
                },
              },
            ],
          }) as any
        );

      component['deleteDemandBatch']().subscribe();

      expect(component['snackbarService'].openSnackBar).toHaveBeenCalled();
      expect(onSaveMock).not.toHaveBeenCalled();
      expect(dialogRefSpy).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', () => {
      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(
          of({
            result: {
              messageType: MessageType.Error,
              messages: ['System error'],
            },
            results: [],
          }) as any
        );

      component['deleteDemandBatch']().subscribe({
        error: () => {},
      });

      expect(component['snackbarService'].openSnackBar).toHaveBeenCalled();
    });
  });

  describe('firstEditableDate', () => {
    it('should return the correct first editable date based on period type', () => {
      expect(component['firstEditableDate']).toBeDefined();

      // Set to weekly period type
      component['formGroup'].controls.periodType.setValue({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });
      expect(component['firstEditableDate'] instanceof Date).toBe(true);

      // Set to monthly period type
      component['formGroup'].controls.periodType.setValue({
        id: DateRangePeriod.Monthly,
        text: 'Monthly',
      });
      expect(component['firstEditableDate'] instanceof Date).toBe(true);
    });
  });

  describe('periodTypeOptions', () => {
    it('should initialize periodTypeOptions with default period types', () => {
      expect((component as any).periodTypeOptions).toBeDefined();
      expect((component as any).periodTypeOptions.length).toBeGreaterThan(0);
    });
  });

  describe('isFormInvalid', () => {
    it('should return true when form is invalid', () => {
      // Set invalid dates to make form invalid
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      component['formGroup'].controls.startDate.setValue(today);
      component['formGroup'].controls.endDate.setValue(yesterday);

      expect(component['isFormInvalid']()).toBe(true);
    });

    it('should return false when form is valid', () => {
      // Set valid dates
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      component['formGroup'].controls.startDate.setValue(today);
      component['formGroup'].controls.endDate.setValue(nextMonth);
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
      ]);

      expect(component['isFormInvalid']()).toBe(false);
    });
  });

  describe('deleteOnConfirmation with dialog interactions', () => {
    it('should proceed with deletion when confirmation dialog returns true', () => {
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
      ]);

      // Mock confirmation dialog to return true when closed
      dialogSpy.mockReturnValueOnce({
        afterClosed: () => of(true),
      });

      // Mock loading dialog
      dialogSpy.mockReturnValueOnce({
        afterClosed: () => of(true),
      });

      component['deleteOnConfirmation']();

      expect(dialogSpy).toHaveBeenCalledTimes(2);
      // First call should be to confirmation dialog
      expect(dialogSpy.mock.calls[0][0].name).toBe(
        'ConfirmationDialogComponent'
      );
    });

    it('should not proceed with deletion when confirmation dialog returns false', () => {
      component['formGroup'].controls.materialNumbers.setValue([
        { id: '12345', text: 'Material 1' },
      ]);

      // Mock confirmation dialog to return false when closed
      dialogSpy.mockReturnValueOnce({
        afterClosed: () => of(false),
      });

      component['deleteOnConfirmation']();

      expect(dialogSpy).toHaveBeenCalledTimes(1);
      // Second dialog (loading) should not be called
      expect(dialogSpy.mock.calls[0][1].disableClose).toBe(true);
    });
  });

  describe('error handling in deleteDemandBatch', () => {
    it('should handle general API errors with proper error message', () => {
      const snackbarSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );
      const errorMessage = 'API Error';

      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(throwError(() => errorMessage));

      expect(() => {
        component['deleteDemandBatch']().subscribe();
      }).not.toThrow();

      expect(snackbarSpy).toHaveBeenCalled();
    });

    it('should show specific error messages for each material with error', () => {
      const snackbarSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );

      jest
        .spyOn(
          component['demandValidationService'],
          'deleteValidatedDemandBatch'
        )
        .mockReturnValue(
          of({
            result: { messageType: MessageType.Success },
            results: [
              {
                materialNumber: '12345',
                result: {
                  messageType: MessageType.Error,
                  messages: ['Error for material 12345'],
                },
              },
              {
                materialNumber: '67890',
                result: {
                  messageType: MessageType.Error,
                  messages: ['Error for material 67890'],
                },
              },
            ],
          }) as any
        );

      component['deleteDemandBatch']().subscribe();

      expect(snackbarSpy).toHaveBeenCalled();
      // Should contain both material errors in the message
      const snackbarMessage = snackbarSpy.mock.calls[0][0];
      expect(snackbarMessage).toContain('12345');
      expect(snackbarMessage).toContain('67890');
    });
  });
});
