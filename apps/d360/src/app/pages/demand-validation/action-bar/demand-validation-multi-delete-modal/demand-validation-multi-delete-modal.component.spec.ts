import { of } from 'rxjs';

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
});
