import { Validators } from '@angular/forms';

import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';

import { DialogControlsService } from '.';

describe('DialogControlsService', () => {
  let spectator: SpectatorService<DialogControlsService>;
  let service: DialogControlsService;

  const createService = createServiceFactory({
    service: DialogControlsService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(DialogControlsService);
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
      expect(control.hasValidator(service['MATERIAL_NUMBER_VALIDATOR'])).toBe(
        true
      );
    });

    it('should create a steelNumberControl with value and disabled set', () => {
      const control = service.getSteelNumberControl('1.1234', true);

      expect(typeof control.value).toEqual('string');
      expect(control.value).toEqual('1.1234');
      expect(control.disabled).toBe(true);
      expect(control.hasValidator(service['MATERIAL_NUMBER_VALIDATOR'])).toBe(
        true
      );
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
});
