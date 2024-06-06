import { Validators } from '@angular/forms';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DialogControlsService } from '.';

describe('DialogControlsService', () => {
  let spectator: SpectatorService<DialogControlsService>;
  let service: DialogControlsService;

  const createService = createServiceFactory({
    service: DialogControlsService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('getControl', () => {
    it('should create a control of the given type', () => {
      const control = service.getControl<number>();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
    });

    it('should create a control of the given type with value and disabled set', () => {
      const control = service.getControl<number>(1, true);

      expect(typeof control.value).toEqual('number');
      expect(control.value).toEqual(1);
      expect(control.disabled).toBe(true);
    });
  });

  describe('getRequiredControl', () => {
    it('should create a required control of the given type', () => {
      const control = service.getRequiredControl<number>();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
      expect(control.hasValidator(Validators.required)).toBe(true);
    });

    it('should create a required control of the given type with value and disabled set', () => {
      const control = service.getRequiredControl<number>(1, true);

      expect(typeof control.value).toEqual('number');
      expect(control.value).toEqual(1);
      expect(control.disabled).toBe(true);
      expect(control.hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('getSteelNumberControl', () => {
    it('should create a steelNumberControl', () => {
      const control = service.getSteelNumberControl();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
      expect(
        control.hasValidator(service['STEEL_MATERIAL_NUMBER_VALIDATOR'])
      ).toBe(true);
    });

    it('should create a steelNumberControl with value and disabled set', () => {
      const control = service.getSteelNumberControl('1.1234', true);

      expect(typeof control.value).toEqual('string');
      expect(control.value).toEqual('1.1234');
      expect(control.disabled).toBe(true);
      expect(
        control.hasValidator(service['STEEL_MATERIAL_NUMBER_VALIDATOR'])
      ).toBe(true);
    });
  });

  describe('getCopperNumberControl', () => {
    it('should create a copperNumberControl', () => {
      const control = service.getCopperNumberControl();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
      expect(
        control.hasValidator(service['COPPER_MATERIAL_NUMBER_VALIDATOR'])
      ).toBe(true);
    });

    it('should create a copperNumberControl with value and disabled set', () => {
      const control = service.getCopperNumberControl('2.1234', true);

      expect(typeof control.value).toEqual('string');
      expect(control.value).toEqual('2.1234');
      expect(control.disabled).toBe(true);
      expect(
        control.hasValidator(service['COPPER_MATERIAL_NUMBER_VALIDATOR'])
      ).toBe(true);
    });
  });

  describe('getNumberControl', () => {
    it('should create a numberControl', () => {
      const control = service.getNumberControl();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
    });

    it('should create a numberNumberControl with value and disabled set', () => {
      const control = service.getNumberControl(1, true);

      expect(typeof control.value).toEqual('number');
      expect(control.value).toEqual(1);
      expect(control.disabled).toBe(true);
    });

    it('should create a numberNumberControl with min and max validator', () => {
      const control = service.getNumberControl(30, false, 5, 95);

      expect(typeof control.value).toEqual('number');
      expect(control.value).toEqual(30);
      expect(control.valid).toBeTruthy();

      control.setValue(1, { onlySelf: true });
      expect(control.valid).toBeFalsy();

      control.setValue(99, { onlySelf: true });
      expect(control.valid).toBeFalsy();
    });
  });

  describe('getRequiredNumberControl', () => {
    it('should create a required numberControl', () => {
      const control = service.getRequiredNumberControl();

      expect(typeof control.value).toEqual('undefined');
      expect(control.disabled).toBe(false);
      expect(control.hasValidator(Validators.required)).toBe(true);
    });

    it('should create a required numberNumberControl with value and disabled set', () => {
      const control = service.getRequiredNumberControl(1, true);

      expect(typeof control.value).toEqual('number');
      expect(control.value).toEqual(1);
      expect(control.disabled).toBe(true);
      expect(control.hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('getSupplierBusinessPartnerIdControl', () => {
    it('should create a Validator for Business Partner Ids', () => {
      const control = service.getSupplierBusinessPartnerIdControl();

      expect(control.value).toBeFalsy();
      expect(control.disabled).toBe(false);
      expect(control.hasValidator(Validators.required)).toBe(false);
    });
  });
});
