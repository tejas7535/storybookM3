import { signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { Stub } from '../../../shared/test/stub.class';
import { ValidationHelper } from '../../../shared/utils/validation/validation-helper';
import { IMRValidatorsService } from './imr-validators.service';

// Mock ValidationHelper
jest.mock('../../../shared/utils/validation/validation-helper', () => ({
  ValidationHelper: {
    getStartEndDateValidationErrors: jest.fn(),
  },
}));

describe('IMRValidatorsService', () => {
  let service: IMRValidatorsService;
  let mockTranslocoLocaleService: any;

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 1, 1));

    mockTranslocoLocaleService = {
      localizeDate: jest.fn().mockReturnValue('2023-01-01'),
      localizeNumber: jest.fn().mockReturnValue(''),
      localeChanges$: new BehaviorSubject('en-US'),
      getLocale: jest.fn().mockReturnValue('en-US'),
    };

    service = Stub.get<IMRValidatorsService>({
      component: IMRValidatorsService,
      providers: [
        {
          provide: TranslocoLocaleService,
          useValue: mockTranslocoLocaleService,
        },
      ],
    });
    Stub.initValidationHelper();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('keepMaterialOnPackagingChange', () => {
    it('should return error when packaging change materials do not match', () => {
      const materialCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        material1: new FormControl({ id: '123456789' }),
        material2: new FormControl({ id: '987654321' }),
      });
      const validator = service.keepMaterialOnPackagingChange(
        'material2',
        materialCustomErrorMessage
      );
      const material1Control = formGroup.get('material1');
      const result = validator(material1Control as FormControl);

      expect(result).toEqual({ keepMaterialOnPackagingChange: true });
      expect(materialCustomErrorMessage()).toBe(
        'sap_message./SGD/SCM_SOP_SALES.107'
      );
    });

    it('should return null when materials match for packaging change', () => {
      const materialCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        material1: new FormControl({ id: '123456789' }),
        material2: new FormControl({ id: '123456789' }),
      });

      const validator = service.keepMaterialOnPackagingChange(
        'material2',
        materialCustomErrorMessage
      );
      const material1Control = formGroup.get('material1');
      const result = validator(material1Control as FormControl);

      expect(result).toBeNull();
      expect(materialCustomErrorMessage()).toBeNull();
    });

    it('should return null when not packaging change', () => {
      const materialCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'OTHER_TYPE' }),
        material1: new FormControl({ id: '123456789' }),
        material2: new FormControl({ id: '987654321' }),
      });

      const validator = service.keepMaterialOnPackagingChange(
        'material2',
        materialCustomErrorMessage
      );
      const material1Control = formGroup.get('material1');
      const result = validator(material1Control as FormControl);

      expect(result).toBeNull();
      expect(materialCustomErrorMessage()).toBeNull();
    });

    it('should trim material numbers to 13 characters', () => {
      const materialCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        material1: new FormControl({ id: '12345678901234567890' }),
        material2: new FormControl({ id: '9876543210987' }),
      });

      const validator = service.keepMaterialOnPackagingChange(
        'material2',
        materialCustomErrorMessage
      );
      const material1Control = formGroup.get('material1');
      const result = validator(material1Control as FormControl);

      expect(result).toEqual({ keepMaterialOnPackagingChange: true });
      expect(materialCustomErrorMessage()).toBe(
        'sap_message./SGD/SCM_SOP_SALES.107'
      );
    });
  });

  describe('cutoverDateBeforeSOP', () => {
    let mockValidationHelper: jest.Mocked<typeof ValidationHelper>;

    beforeEach(() => {
      mockValidationHelper = ValidationHelper as jest.Mocked<
        typeof ValidationHelper
      >;
      jest.clearAllMocks();
    });

    it('should return null when ValidationHelper returns no errors', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-02-15')),
        startOfProduction: new FormControl(new Date('2025-02-14')),
      });

      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        null
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toBeNull();
      expect(startOfProductionCustomErrorMessage()).toBeNull();
      expect(
        mockValidationHelper.getStartEndDateValidationErrors
      ).toHaveBeenCalledWith(
        formGroup,
        false,
        'cutoverDate',
        'startOfProduction',
        false
      );
    });

    it('should set error message and mark fields as touched when endDate error exists', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        startOfProduction: new FormControl(new Date('2025-01-01')),
      });

      const mockErrors = { endDate: ['end-before-start'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      // Spy on markAsTouched methods
      const cutoverDateControl = formGroup.get('cutoverDate');
      const startOfProductionControl = formGroup.get('startOfProduction');
      const cutoverDateSpy = jest.spyOn(
        cutoverDateControl as FormControl,
        'markAsTouched'
      );
      const startOfProductionSpy = jest.spyOn(
        startOfProductionControl as FormControl,
        'markAsTouched'
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(startOfProductionCustomErrorMessage()).toBe(
        'internal_material_replacement.error.startOfProductionBeforeCutoverDate'
      );
      expect(cutoverDateSpy).toHaveBeenCalled();
      expect(startOfProductionSpy).toHaveBeenCalled();
    });

    it('should not set error message when endDate error does not exist but other errors do', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-01')),
        startOfProduction: new FormControl(new Date('2025-01-15')),
      });

      const mockErrors = { someOtherError: ['other-error'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(startOfProductionCustomErrorMessage()).toBeNull();
    });

    it('should handle missing form controls gracefully', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        // Missing cutoverDate and startOfProduction controls
      });

      const mockErrors = { endDate: ['end-before-start'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );

      // Should not throw error even with missing controls
      expect(() => {
        const result = validator(formGroup);
        expect(result).toEqual(mockErrors);
        expect(startOfProductionCustomErrorMessage()).toBe(
          'internal_material_replacement.error.startOfProductionBeforeCutoverDate'
        );
      }).not.toThrow();
    });

    it('should clear error message when validation passes after previously failing', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(
        'previous error'
      );
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        startOfProduction: new FormControl(new Date('2025-01-20')),
      });

      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        null
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toBeNull();
      expect(startOfProductionCustomErrorMessage()).toBeNull();
    });

    it('should return error when cutover date equals start of production date', () => {
      const startOfProductionCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        startOfProduction: new FormControl(new Date('2025-01-15')),
      });

      const mockErrors = { endDate: ['dates-equal'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const cutoverDateControl = formGroup.get('cutoverDate');
      const startOfProductionControl = formGroup.get('startOfProduction');
      const cutoverDateSpy = jest.spyOn(
        cutoverDateControl as FormControl,
        'markAsTouched'
      );
      const startOfProductionSpy = jest.spyOn(
        startOfProductionControl as FormControl,
        'markAsTouched'
      );

      const validator = service.cutoverDateBeforeSOP(
        startOfProductionCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(startOfProductionCustomErrorMessage()).toBe(
        'internal_material_replacement.error.startOfProductionBeforeCutoverDate'
      );
      expect(cutoverDateSpy).toHaveBeenCalled();
      expect(startOfProductionSpy).toHaveBeenCalled();
    });
  });

  describe('replacementBeforeCutoverDate', () => {
    let mockValidationHelper: jest.Mocked<typeof ValidationHelper>;

    beforeEach(() => {
      mockValidationHelper = ValidationHelper as jest.Mocked<
        typeof ValidationHelper
      >;
      jest.clearAllMocks();
    });

    it('should return null when ValidationHelper returns no errors', () => {
      const replacementDateCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-02-15')),
        replacementDate: new FormControl(new Date('2025-02-14')),
      });

      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        null
      );

      const validator = service.replacementBeforeCutoverDate(
        replacementDateCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toBeNull();
      expect(replacementDateCustomErrorMessage()).toBeNull();
      expect(
        mockValidationHelper.getStartEndDateValidationErrors
      ).toHaveBeenCalledWith(
        formGroup,
        false,
        'cutoverDate',
        'replacementDate',
        false
      );
    });

    it('should set error message and mark fields as touched when endDate error exists', () => {
      const replacementDateCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        replacementDate: new FormControl(new Date('2025-01-01')),
      });

      const mockErrors = { endDate: ['end-before-start'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const cutoverDateControl = formGroup.get('cutoverDate');
      const replacementDateControl = formGroup.get('replacementDate');
      const cutoverDateSpy = jest.spyOn(
        cutoverDateControl as FormControl,
        'markAsTouched'
      );
      const replacementDateSpy = jest.spyOn(
        replacementDateControl as FormControl,
        'markAsTouched'
      );

      const validator = service.replacementBeforeCutoverDate(
        replacementDateCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(replacementDateCustomErrorMessage()).toBe(
        'internal_material_replacement.error.substitutionBeforeCutoverDate'
      );
      expect(cutoverDateSpy).toHaveBeenCalled();
      expect(replacementDateSpy).toHaveBeenCalled();
    });

    it('should not set error message when endDate error does not exist but other errors do', () => {
      const replacementDateCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-01')),
        replacementDate: new FormControl(new Date('2025-01-15')),
      });

      const mockErrors = { someOtherError: ['other-error'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const validator = service.replacementBeforeCutoverDate(
        replacementDateCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(replacementDateCustomErrorMessage()).toBeNull();
    });

    it('should clear error message when validation passes after previously failing', () => {
      const replacementDateCustomErrorMessage = signal<string | null>(
        'previous error'
      );
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        replacementDate: new FormControl(new Date('2025-01-10')),
      });

      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        null
      );

      const validator = service.replacementBeforeCutoverDate(
        replacementDateCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toBeNull();
      expect(replacementDateCustomErrorMessage()).toBeNull();
    });

    it('should return error when replacement date equals cutover date', () => {
      const replacementDateCustomErrorMessage = signal<string | null>(null);
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-01-15')),
        replacementDate: new FormControl(new Date('2025-01-15')),
      });

      const mockErrors = { endDate: ['dates-equal'] };
      mockValidationHelper.getStartEndDateValidationErrors.mockReturnValue(
        mockErrors
      );

      const cutoverDateControl = formGroup.get('cutoverDate');
      const replacementDateControl = formGroup.get('replacementDate');
      const cutoverDateSpy = jest.spyOn(
        cutoverDateControl as FormControl,
        'markAsTouched'
      );
      const replacementDateSpy = jest.spyOn(
        replacementDateControl as FormControl,
        'markAsTouched'
      );

      const validator = service.replacementBeforeCutoverDate(
        replacementDateCustomErrorMessage
      );
      const result = validator(formGroup);

      expect(result).toEqual(mockErrors);
      expect(replacementDateCustomErrorMessage()).toBe(
        'internal_material_replacement.error.substitutionBeforeCutoverDate'
      );
      expect(cutoverDateSpy).toHaveBeenCalled();
      expect(replacementDateSpy).toHaveBeenCalled();
    });
  });

  describe('validateAgainstExistingDate', () => {
    it('should return null when date equals prefilled date', () => {
      const errorMessage = signal<string | null>(null);
      const preFilledDate = new Date('2025-01-01');
      const validator = service.validateAgainstExistingDate(
        preFilledDate,
        errorMessage
      );
      const control = new FormControl(new Date('2025-01-01'));

      const result = validator(control);

      expect(result).toBeNull();
      expect(errorMessage()).toBeNull();
    });

    it('should return error when date is before today', () => {
      const errorMessage = signal<string | null>(null);
      const preFilledDate = new Date('2025-01-01');
      const validator = service.validateAgainstExistingDate(
        preFilledDate,
        errorMessage
      );
      const control = new FormControl(new Date('2020-01-01'));
      mockTranslocoLocaleService.localizeDate.mockReturnValue('2020-01-01');

      const result = validator(control);
      expect(result).toEqual({ customDatepickerMin: true });
      expect(errorMessage()).toBe('error.date.beforeMinEditingExistingRecord');
    });

    it('should return error when date is after max date', () => {
      const errorMessage = signal<string | null>(null);
      const preFilledDate = new Date('2025-01-01');
      const validator = service.validateAgainstExistingDate(
        preFilledDate,
        errorMessage
      );
      const control = new FormControl(new Date('2025-04-01'));
      mockTranslocoLocaleService.localizeDate.mockReturnValue('2025-11-01');
      (service.MAX_DATE as any) = new Date('2024-10-31');

      const result = validator(control);
      expect(result).toEqual({ customDatepickerMax: true });
      expect(errorMessage()).toBe('error.date.afterMaxEditingExistingRecord');
    });
  });

  describe('setOrRemoveRequired', () => {
    it('should add required validator when required is true', () => {
      const control = new FormControl('');
      service.setOrRemoveRequired(true, control);

      expect(control.hasError('required')).toBe(true);
    });

    it('should remove required validator when required is false', () => {
      const control = new FormControl('', Validators.required);
      expect(control.hasError('required')).toBe(true);

      service.setOrRemoveRequired(false, control);

      expect(control.hasError('required')).toBe(false);
    });
  });
});
