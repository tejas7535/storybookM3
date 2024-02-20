import { FormGroup, Validators } from '@angular/forms';

import {
  ApplicationFormValue,
  LubricantFormValue,
  LubricationPointsFormValue,
  RecommendationFormValue,
} from '@lsa/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LsaFormService } from './lsa-form.service';

describe('LsaFormService', () => {
  let spectator: SpectatorService<LsaFormService>;
  let service: LsaFormService;

  const createService = createServiceFactory(LsaFormService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('isValid', () => {
    it('should return form valid', () => {
      expect(service.isValid).toBe(false);

      service.recommendationForm = { valid: true } as FormGroup;

      expect(service.isValid).toBe(true);
    });
  });

  describe('getLubricationPointsForm', () => {
    it('should return the lubricationPointsForm', () => {
      const mockForm = {} as FormGroup;
      service.lubricationPointsForm = mockForm;

      const result = service.getLubricationPointsForm();

      expect(result).toEqual(mockForm);
    });
  });

  describe('updateLubricationPointsForm', () => {
    it('should patch the lubricationPointsForm', () => {
      const mockValue = {} as LubricationPointsFormValue;
      service.lubricationPointsForm.patchValue = jest.fn();

      service.updateLubricationPointsForm(mockValue);

      expect(service.lubricationPointsForm.patchValue).toHaveBeenCalledWith(
        mockValue,
        { emitEvent: undefined, onlySelf: true }
      );
    });
  });

  describe('getLubricantForm', () => {
    it('should return the lubricantForm', () => {
      const mockForm = {} as FormGroup;
      service.lubricantForm = mockForm;

      const result = service.getLubricantForm();

      expect(result).toEqual(mockForm);
    });
  });

  describe('updateLubricantForm', () => {
    it('should patch the lubricantForm', () => {
      const mockValue = {} as LubricantFormValue;
      service.lubricantForm.patchValue = jest.fn();

      service.updateLubricantForm(mockValue);

      expect(service.lubricantForm.patchValue).toHaveBeenCalledWith(mockValue, {
        emitEvent: undefined,
        onlySelf: true,
      });
    });
  });

  describe('getApplicationForm', () => {
    it('should return the applicationForm', () => {
      const mockForm = {} as FormGroup;
      service.applicationForm = mockForm;

      const result = service.getApplicationForm();

      expect(result).toEqual(mockForm);
    });
  });

  describe('updateApplicationForm', () => {
    it('should patch the applicationForm', () => {
      const mockValue = {} as ApplicationFormValue;
      service.applicationForm.patchValue = jest.fn();

      service.updateApplicationForm(mockValue);

      expect(service.applicationForm.patchValue).toHaveBeenCalledWith(
        mockValue,
        { emitEvent: undefined, onlySelf: true }
      );
    });
  });

  describe('getRecommendationForm', () => {
    it('should return the recommendationForm', () => {
      const mockForm = {} as FormGroup;
      service.recommendationForm = mockForm;

      const result = service.getRecommendationForm();

      expect(result).toEqual(mockForm);
    });
  });

  describe('updateRecommendationForm', () => {
    it('should patch the recommendationForm', () => {
      const mockValue = {} as RecommendationFormValue;
      service.recommendationForm.patchValue = jest.fn();

      service.updateRecommendationForm(mockValue);

      expect(service.recommendationForm.patchValue).toHaveBeenCalledWith(
        mockValue
      );
    });
  });

  describe('init', () => {
    it('should init the form with defaults', () => {
      service['initForm']();

      expect(service.lubricationPointsForm.getRawValue()).toMatchSnapshot();
      expect(service.lubricantForm.getRawValue()).toMatchSnapshot();
      expect(service.applicationForm.getRawValue()).toMatchSnapshot();
      expect(service.recommendationForm.getRawValue()).toMatchSnapshot();
    });
  });

  describe('createFormControl', () => {
    it('should return a form control', () => {
      const result = service['createFormControl']<string>('value');

      expect(result.value).toEqual('value');
      expect(result.hasValidator(Validators.required)).toBe(false);
    });

    it('should return a required form control', () => {
      const result = service['createFormControl']<string>('value', true);

      expect(result.value).toEqual('value');
      expect(result.hasValidator(Validators.required)).toBe(true);
    });
  });
});
