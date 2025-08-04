import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CalculationParametersFormFactory } from './calculation-parameters-form.factory';

describe('CalculationParametersFormFactory', () => {
  let spectator: SpectatorService<CalculationParametersFormFactory>;
  let service: CalculationParametersFormFactory;

  const createService = createServiceFactory({
    service: CalculationParametersFormFactory,
    providers: [
      {
        provide: ProductSelectionFacade,
        useValue: {
          templateValidator: jest.fn().mockReturnValue(() => of(undefined)),
        },
      },
    ],
    mocks: [CalculationParametersFormHelperService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createForm', () => {
    it('should create form for standard bearing', () => {
      const bearingClass: CatalogServiceProductClass = CATALOG_BEARING_TYPE;
      const result = service.createForm(bearingClass);

      expect(result).toBeDefined();
      expect(result.form).toBeInstanceOf(FormGroup);
      expect(result.operationConditionsForm).toBeInstanceOf(FormGroup);
      expect(result.formErrors$).toBeDefined();

      // Check standard bearing form structure
      const operationConditions = result.operationConditionsForm;
      expect(operationConditions.get('loadCaseData')).toBeInstanceOf(FormArray);
      expect(operationConditions.get('lubrication')).toBeInstanceOf(FormGroup);
      expect(operationConditions.get('contamination')).toBeInstanceOf(
        FormControl
      );
      expect(operationConditions.get('ambientTemperature')).toBeInstanceOf(
        FormControl
      );
      expect(operationConditions.get('time')).toBeInstanceOf(FormControl);
      expect(operationConditions.get('energySource')).toBeInstanceOf(FormGroup);
      expect(operationConditions.get('conditionOfRotation')).toBeInstanceOf(
        FormControl
      );
    });

    it('should create form for slewing bearing', () => {
      const bearingClass: CatalogServiceProductClass = SLEWING_BEARING_TYPE;
      const result = service.createForm(bearingClass);

      expect(result).toBeDefined();
      expect(result.form).toBeInstanceOf(FormGroup);
      expect(result.operationConditionsForm).toBeInstanceOf(FormGroup);
      expect(result.formErrors$).toBeDefined();

      // Check slewing bearing form structure (simplified)
      const operationConditions = result.operationConditionsForm;
      expect(operationConditions.get('loadCaseData')).toBeInstanceOf(FormArray);
      expect(operationConditions.get('time')).toBeInstanceOf(FormControl);

      // Should NOT have standard bearing specific fields
      expect(operationConditions.get('lubrication')).toBeNull();
      expect(operationConditions.get('contamination')).toBeNull();
      expect(operationConditions.get('ambientTemperature')).toBeNull();
      expect(operationConditions.get('energySource')).toBeNull();
      expect(operationConditions.get('conditionOfRotation')).toBeNull();
    });

    it('should create form with custom debounce time', () => {
      const bearingClass: CatalogServiceProductClass = CATALOG_BEARING_TYPE;
      const customDebounceTime = 500;

      const result = service.createForm(bearingClass, customDebounceTime);

      expect(result).toBeDefined();
      expect(result.formErrors$).toBeDefined();
    });
  });

  describe('createLoadCaseDataFormGroup', () => {
    const loadCaseName = 'Test Load Case';
    const operatingTemperatureValue = 70;

    it('should create standard bearing load case form group', () => {
      const bearingClass: CatalogServiceProductClass = CATALOG_BEARING_TYPE;

      const formGroup = service.createLoadCaseDataFormGroup(
        loadCaseName,
        operatingTemperatureValue,
        bearingClass
      );

      expect(formGroup).toBeInstanceOf(FormGroup);

      // Check base structure
      expect(formGroup.get('rotation')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('operatingTime')).toBeInstanceOf(FormControl);
      expect(formGroup.get('operatingTemperature')).toBeInstanceOf(FormControl);
      expect(formGroup.get('loadCaseName')).toBeInstanceOf(FormControl);

      // Check standard bearing specific structure (load instead of force/moment)
      expect(formGroup.get('load')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('load.radialLoad')).toBeInstanceOf(FormControl);
      expect(formGroup.get('load.axialLoad')).toBeInstanceOf(FormControl);
      expect(formGroup.get('force')).toBeNull();
      expect(formGroup.get('moment')).toBeNull();

      // Check initial values
      expect(formGroup.get('loadCaseName')?.value).toBe(loadCaseName);
      expect(formGroup.get('operatingTemperature')?.value).toBe(
        operatingTemperatureValue
      );
      expect(formGroup.get('rotation.typeOfMotion')?.value).toBe('LB_ROTATING');
    });

    it('should create slewing bearing load case form group', () => {
      const bearingClass: CatalogServiceProductClass = SLEWING_BEARING_TYPE;

      const formGroup = service.createLoadCaseDataFormGroup(
        loadCaseName,
        operatingTemperatureValue,
        bearingClass
      );

      expect(formGroup).toBeInstanceOf(FormGroup);

      // Check base structure
      expect(formGroup.get('rotation')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('operatingTime')).toBeInstanceOf(FormControl);
      expect(formGroup.get('loadCaseName')).toBeInstanceOf(FormControl);

      // Slewing bearings should NOT have operating temperature
      expect(formGroup.get('operatingTemperature')).toBeNull();

      // Check slewing bearing specific structure (force and moment instead of load)
      expect(formGroup.get('force')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('force.fx')).toBeInstanceOf(FormControl);
      expect(formGroup.get('force.fy')).toBeInstanceOf(FormControl);
      expect(formGroup.get('moment')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('moment.mx')).toBeInstanceOf(FormControl);
      expect(formGroup.get('moment.my')).toBeInstanceOf(FormControl);
      expect(formGroup.get('load')).toBeNull();

      // Check initial values
      expect(formGroup.get('loadCaseName')?.value).toBe(loadCaseName);
      expect(formGroup.get('rotation.typeOfMotion')?.value).toBe('LB_ROTATING');
    });

    it('should create form group with default values when no bearing class provided', () => {
      const formGroup = service.createLoadCaseDataFormGroup(loadCaseName);

      expect(formGroup).toBeInstanceOf(FormGroup);

      // Should default to standard bearing structure
      expect(formGroup.get('load')).toBeInstanceOf(FormGroup);
      expect(formGroup.get('force')).toBeNull();
      expect(formGroup.get('moment')).toBeNull();
    });

    it('should call templateValidator for form controls', () => {
      const mockProductSelectionFacade = spectator.inject(
        ProductSelectionFacade
      );
      const bearingClass: CatalogServiceProductClass = SLEWING_BEARING_TYPE;

      service.createLoadCaseDataFormGroup(
        loadCaseName,
        operatingTemperatureValue,
        bearingClass
      );

      // Verify template validators are called for slewing bearing fields
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDLC_SPEED'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDSLC_MOVEMENT_FREQUENCY'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDLD_FX'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDLD_FY'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDLD_MX'
      );
      expect(mockProductSelectionFacade.templateValidator).toHaveBeenCalledWith(
        'IDLD_MY'
      );
    });

    describe('Form Validation', () => {
      it('should set required validators on key fields', () => {
        const formGroup = service.createLoadCaseDataFormGroup(loadCaseName);

        const rotationTypeControl = formGroup.get('rotation.typeOfMotion');
        const operatingTempControl = formGroup.get('operatingTemperature');

        expect(rotationTypeControl?.hasError('required')).toBe(false); // Has default value

        operatingTempControl?.setValue(undefined);
        expect(operatingTempControl?.hasError('required')).toBe(true);
      });

      it('should set max validators correctly', () => {
        const formGroup = service.createLoadCaseDataFormGroup(loadCaseName);

        const operatingTimeControl = formGroup.get('operatingTime');

        operatingTimeControl?.setValue(150);
        expect(operatingTimeControl?.hasError('max')).toBe(true);

        operatingTimeControl?.setValue(50);
        expect(operatingTimeControl?.hasError('max')).toBe(false);
      });
    });
  });

  describe('Rotation Form Group', () => {
    it('should create rotation form group with correct structure', () => {
      const formGroup = service.createLoadCaseDataFormGroup('test');
      const rotationGroup = formGroup.get('rotation') as FormGroup;

      expect(rotationGroup.get('typeOfMotion')).toBeInstanceOf(FormControl);
      expect(rotationGroup.get('rotationalSpeed')).toBeInstanceOf(FormControl);
      expect(rotationGroup.get('shiftFrequency')).toBeInstanceOf(FormControl);
      expect(rotationGroup.get('shiftAngle')).toBeInstanceOf(FormControl);

      // Check default value
      expect(rotationGroup.get('typeOfMotion')?.value).toBe('LB_ROTATING');
    });
  });

  describe('Standard Bearing Specific Forms', () => {
    let standardBearingForm: FormGroup;

    beforeEach(() => {
      const result = service.createForm(CATALOG_BEARING_TYPE);
      standardBearingForm = result.operationConditionsForm;
    });

    it('should create lubrication form group', () => {
      const lubricationGroup = standardBearingForm.get(
        'lubrication'
      ) as FormGroup;

      expect(lubricationGroup.get('lubricationSelection')).toBeInstanceOf(
        FormControl
      );
      expect(lubricationGroup.get('grease')).toBeInstanceOf(FormGroup);
      expect(lubricationGroup.get('oilBath')).toBeInstanceOf(FormGroup);
      expect(lubricationGroup.get('oilMist')).toBeInstanceOf(FormGroup);
      expect(lubricationGroup.get('recirculatingOil')).toBeInstanceOf(
        FormGroup
      );
    });

    it('should create grease form group with correct structure', () => {
      const greaseGroup = standardBearingForm.get(
        'lubrication.grease'
      ) as FormGroup;

      expect(greaseGroup.get('selection')).toBeInstanceOf(FormControl);
      expect(greaseGroup.get('typeOfGrease')).toBeInstanceOf(FormGroup);
      expect(greaseGroup.get('environmentalInfluence')).toBeInstanceOf(
        FormControl
      );
      expect(greaseGroup.get('isoVgClass')).toBeInstanceOf(FormGroup);
      expect(greaseGroup.get('viscosity')).toBeInstanceOf(FormGroup);

      // Check default selection
      expect(greaseGroup.get('selection')?.value).toBe('typeOfGrease');
    });

    it('should create oil form groups with viscosity options', () => {
      const oilBathGroup = standardBearingForm.get(
        'lubrication.oilBath'
      ) as FormGroup;
      const oilMistGroup = standardBearingForm.get(
        'lubrication.oilMist'
      ) as FormGroup;

      [oilBathGroup, oilMistGroup].forEach((oilGroup) => {
        expect(oilGroup.get('selection')).toBeInstanceOf(FormControl);
        expect(oilGroup.get('isoVgClass')).toBeInstanceOf(FormGroup);
        expect(oilGroup.get('viscosity')).toBeInstanceOf(FormGroup);
        expect(oilGroup.get('viscosity.ny40')).toBeInstanceOf(FormControl);
        expect(oilGroup.get('viscosity.ny100')).toBeInstanceOf(FormControl);

        // Check default selection
        expect(oilGroup.get('selection')?.value).toBe('isoVgClass');
      });
    });

    it('should create recirculating oil form group with additional fields', () => {
      const recirculatingOilGroup = standardBearingForm.get(
        'lubrication.recirculatingOil'
      ) as FormGroup;

      expect(recirculatingOilGroup.get('selection')).toBeInstanceOf(
        FormControl
      );
      expect(recirculatingOilGroup.get('isoVgClass')).toBeInstanceOf(FormGroup);
      expect(recirculatingOilGroup.get('viscosity')).toBeInstanceOf(FormGroup);
      expect(recirculatingOilGroup.get('oilFlow')).toBeInstanceOf(FormControl);
      expect(
        recirculatingOilGroup.get('oilTemperatureDifference')
      ).toBeInstanceOf(FormControl);
      expect(recirculatingOilGroup.get('externalHeatFlow')).toBeInstanceOf(
        FormControl
      );
    });

    it('should create energy source form group', () => {
      const energySourceGroup = standardBearingForm.get(
        'energySource'
      ) as FormGroup;

      expect(energySourceGroup.get('type')).toBeInstanceOf(FormControl);
      expect(energySourceGroup.get('fossil')).toBeInstanceOf(FormGroup);
      expect(energySourceGroup.get('electric')).toBeInstanceOf(FormGroup);
      expect(energySourceGroup.get('fossil.fossilOrigin')).toBeInstanceOf(
        FormControl
      );
      expect(
        energySourceGroup.get('electric.electricityRegion')
      ).toBeInstanceOf(FormControl);
    });

    it('should set required validators on main form controls', () => {
      const controls = [
        'contamination',
        'ambientTemperature',
        'time',
        'conditionOfRotation',
      ];

      controls.forEach((controlName) => {
        const control = standardBearingForm.get(controlName);
        expect(control).toBeInstanceOf(FormControl);

        control?.setValue(undefined);
        expect(control?.hasError('required')).toBe(true);
      });
    });
  });

  describe('Slewing Bearing Specific Forms', () => {
    let slewingBearingForm: FormGroup;

    beforeEach(() => {
      const result = service.createForm(SLEWING_BEARING_TYPE);
      slewingBearingForm = result.operationConditionsForm;
    });

    it('should create simplified form for slewing bearings', () => {
      expect(slewingBearingForm.get('loadCaseData')).toBeInstanceOf(FormArray);
      expect(slewingBearingForm.get('time')).toBeInstanceOf(FormControl);

      // Should not have standard bearing fields
      expect(slewingBearingForm.get('lubrication')).toBeNull();
      expect(slewingBearingForm.get('contamination')).toBeNull();
      expect(slewingBearingForm.get('ambientTemperature')).toBeNull();
      expect(slewingBearingForm.get('energySource')).toBeNull();
      expect(slewingBearingForm.get('conditionOfRotation')).toBeNull();
    });

    it('should create load case data with force and moment groups', () => {
      const loadCaseArray = slewingBearingForm.get('loadCaseData') as FormArray;
      const firstLoadCase = loadCaseArray.at(0) as FormGroup;

      expect(firstLoadCase.get('force')).toBeInstanceOf(FormGroup);
      expect(firstLoadCase.get('moment')).toBeInstanceOf(FormGroup);
      expect(firstLoadCase.get('load')).toBeNull();
    });
  });

  describe('Form Errors Observable', () => {
    it('should emit form errors when form changes', (done) => {
      const result = service.createForm(CATALOG_BEARING_TYPE);

      result.formErrors$.subscribe((_errors: unknown) => {
        expect(_errors).toBeDefined();
        done();
      });

      // Trigger form change
      result.operationConditionsForm.patchValue({
        time: undefined,
      });
    });

    it('should create form errors observable with custom debounce time', () => {
      const result = service.createForm(CATALOG_BEARING_TYPE, 100);

      expect(result.formErrors$).toBeDefined();
      expect(result.form).toBeInstanceOf(FormGroup);
      expect(result.operationConditionsForm).toBeInstanceOf(FormGroup);
    });
  });

  describe('Template Validator Integration', () => {
    it('should call template validators for all relevant fields', () => {
      const mockProductSelectionFacade = spectator.inject(
        ProductSelectionFacade
      );

      service.createLoadCaseDataFormGroup('test', 70, CATALOG_BEARING_TYPE);

      const expectedValidatorCalls = [
        'IDLC_SPEED',
        'IDSLC_MOVEMENT_FREQUENCY',
        'IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE',
        'IDSLC_RADIAL_LOAD',
        'IDSLC_AXIAL_LOAD',
      ];

      expectedValidatorCalls.forEach((validatorId) => {
        expect(
          mockProductSelectionFacade.templateValidator
        ).toHaveBeenCalledWith(validatorId);
      });
    });

    it('should call template validators for slewing bearing fields', () => {
      const mockProductSelectionFacade = spectator.inject(
        ProductSelectionFacade
      );

      service.createLoadCaseDataFormGroup('test', 70, SLEWING_BEARING_TYPE);

      const expectedValidatorCalls = [
        'IDLC_SPEED',
        'IDSLC_MOVEMENT_FREQUENCY',
        // Note: IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE is NOT called for slewing bearings
        'IDLD_FX',
        'IDLD_FY',
        'IDLD_MX',
        'IDLD_MY',
      ];

      expectedValidatorCalls.forEach((validatorId) => {
        expect(
          mockProductSelectionFacade.templateValidator
        ).toHaveBeenCalledWith(validatorId);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined bearing class gracefully', () => {
      const formGroup = service.createLoadCaseDataFormGroup(
        'test',
        70,
        undefined
      );

      expect(formGroup).toBeInstanceOf(FormGroup);
      // Should default to standard bearing structure
      expect(formGroup.get('load')).toBeInstanceOf(FormGroup);
    });

    it('should handle missing optional parameters', () => {
      const formGroup = service.createLoadCaseDataFormGroup('test');

      expect(formGroup).toBeInstanceOf(FormGroup);
      expect(formGroup.get('loadCaseName')?.value).toBe('test');
      expect(formGroup.get('operatingTemperature')?.value).toBeNull();
    });
  });
});
