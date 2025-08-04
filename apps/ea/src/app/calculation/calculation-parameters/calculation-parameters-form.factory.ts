import { inject, Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, map, Observable, startWith } from 'rxjs';

import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
  LoadCaseData,
} from '@ea/core/store/models';
import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { extractNestedErrors } from '@ea/shared/helper/form.helper';
import { FormSelectValidatorSwitcher } from '@ea/shared/helper/form-select-validation-switcher';

import {
  anyLoadGroupValidator,
  externalHeatFlowValidators,
  increaseInOilTempValidators,
  loadCasesOperatingTimeValidators,
  loadValidators,
  rotationalSpeedValidators,
  rotationValidator,
  shiftAngleValidators,
  shiftFrequencyValidators,
  viscosityGroupValidators,
} from './form-validators';
import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';

export interface CalculationParametersFormResult {
  operationConditionsForm: FormGroup;
  form: FormGroup;
  formErrors$: Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFormFactory {
  private readonly calculationParametersFormHelperService = inject(
    CalculationParametersFormHelperService
  );
  private readonly productSelectionFacade = inject(ProductSelectionFacade);

  createForm(
    bearingClass: CatalogServiceProductClass,
    debounceTimeMs: number = 200
  ): CalculationParametersFormResult {
    const operationConditionsForm =
      bearingClass === SLEWING_BEARING_TYPE
        ? this.createSlewingBearingForm()
        : this.createStandardBearingForm();

    const form = new FormGroup({
      operationConditions: operationConditionsForm,
    });

    const formErrors$ = operationConditionsForm.valueChanges.pipe(
      startWith(operationConditionsForm.value),
      debounceTime(debounceTimeMs),
      map(() => extractNestedErrors(operationConditionsForm))
    );

    return {
      operationConditionsForm,
      form,
      formErrors$,
    };
  }

  createLoadCaseDataFormGroup(
    loadCaseName: string,
    operatingTemperatureValue?: number,
    bearingClass?: CatalogServiceProductClass
  ): FormGroup<LoadCaseDataFormGroupModel> {
    const isSlewingBearing = bearingClass === SLEWING_BEARING_TYPE;

    const baseFormGroup = {
      rotation: new FormGroup(
        {
          typeOfMotion: new FormControl<
            LoadCaseData['rotation']['typeOfMotion']
          >('LB_ROTATING', Validators.required),
          rotationalSpeed: new FormControl<number>(
            undefined,
            rotationalSpeedValidators,
            this.productSelectionFacade.templateValidator('IDLC_SPEED')
          ),
          shiftFrequency: new FormControl<number>(
            undefined,
            shiftFrequencyValidators,
            this.productSelectionFacade.templateValidator(
              'IDSLC_MOVEMENT_FREQUENCY'
            )
          ),
          shiftAngle: new FormControl<number>(undefined, shiftAngleValidators),
        },
        [rotationValidator()]
      ),
      operatingTime: new FormControl<number>(undefined, Validators.max(100)),
      loadCaseName: new FormControl<string>(loadCaseName),
    };

    // eslint-disable-next-line unicorn/prefer-ternary
    if (isSlewingBearing) {
      return new FormGroup<LoadCaseDataFormGroupModel>({
        ...baseFormGroup,
        force: new FormGroup(
          {
            fx: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDLD_FX')
            ),
            fy: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDLD_FY')
            ),
          },
          [anyLoadGroupValidator()]
        ),
        moment: new FormGroup(
          {
            mx: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDLD_MX')
            ),
            my: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDLD_MY')
            ),
          },
          [anyLoadGroupValidator()]
        ),
      });
    } else {
      return new FormGroup<LoadCaseDataFormGroupModel>({
        ...baseFormGroup,
        operatingTemperature: new FormControl<number>(
          operatingTemperatureValue,
          [Validators.required],
          [
            this.productSelectionFacade.templateValidator(
              'IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE'
            ),
          ]
        ),
        load: new FormGroup(
          {
            radialLoad: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDSLC_RADIAL_LOAD')
            ),
            axialLoad: new FormControl<number>(
              undefined,
              loadValidators,
              this.productSelectionFacade.templateValidator('IDSLC_AXIAL_LOAD')
            ),
          },
          [anyLoadGroupValidator()]
        ),
      });
    }
  }

  private createStandardBearingForm(): FormGroup {
    return new FormGroup({
      loadCaseData: new FormArray(
        [
          this.createLoadCaseDataFormGroup(
            'load case',
            undefined,
            CATALOG_BEARING_TYPE
          ),
        ],
        loadCasesOperatingTimeValidators(
          this.calculationParametersFormHelperService
        )
      ),
      lubrication: this.createLubricationFormGroup(),
      contamination: new FormControl<
        CalculationParametersOperationConditions['contamination']
      >(undefined, [Validators.required]),
      ambientTemperature: new FormControl<number>(
        undefined,
        [Validators.required],
        [this.productSelectionFacade.templateValidator('IDSLC_TEMPERATURE')]
      ),
      time: new FormControl<number>(undefined, [Validators.required]),
      energySource: this.createEnergySourceFormGroup(),
      conditionOfRotation: new FormControl<
        CalculationParametersOperationConditions['conditionOfRotation']
      >(undefined, [Validators.required]),
    });
  }

  private createSlewingBearingForm(): FormGroup {
    return new FormGroup({
      loadCaseData: new FormArray(
        [
          this.createLoadCaseDataFormGroup(
            'load case',
            undefined,
            SLEWING_BEARING_TYPE
          ),
        ],
        loadCasesOperatingTimeValidators(
          this.calculationParametersFormHelperService
        )
      ),
      time: new FormControl<number>(undefined, [Validators.required]),
    });
  }

  private createLubricationFormGroup(): FormGroup {
    return new FormGroup({
      lubricationSelection: new FormControl<
        'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil'
      >(undefined, [FormSelectValidatorSwitcher()]),
      grease: this.createGreaseFormGroup(),
      oilBath: this.createOilFormGroup(),
      oilMist: this.createOilFormGroup(),
      recirculatingOil: this.createRecirculatingOilFormGroup(),
    });
  }

  private createGreaseFormGroup(): FormGroup {
    return new FormGroup({
      selection: new FormControl<'typeOfGrease' | 'isoVgClass' | 'viscosity'>(
        'typeOfGrease',
        [FormSelectValidatorSwitcher({ onlyFormGroups: true })]
      ),
      typeOfGrease: new FormGroup({
        typeOfGrease: new FormControl<`LB_${string}`>(undefined, [
          Validators.required,
        ]),
      }),
      environmentalInfluence: new FormControl<
        | 'LB_LOW_AMBIENT_INFLUENCE'
        | 'LB_AVERAGE_AMBIENT_INFLUENCE'
        | 'LB_HIGH_AMBIENT_INFLUENCE'
      >(undefined, []),
      isoVgClass: new FormGroup({
        isoVgClass: new FormControl<number>(undefined, [Validators.required]),
      }),
      viscosity: new FormGroup(
        {
          ny40: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_40')
          ),
          ny100: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_100')
          ),
        },
        viscosityGroupValidators()
      ),
    });
  }

  private createOilFormGroup(): FormGroup {
    return new FormGroup({
      selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
        FormSelectValidatorSwitcher(),
      ]),
      isoVgClass: new FormGroup({
        isoVgClass: new FormControl<number>(undefined, [Validators.required]),
      }),
      viscosity: new FormGroup(
        {
          ny40: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_40')
          ),
          ny100: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_100')
          ),
        },
        viscosityGroupValidators()
      ),
    });
  }

  private createRecirculatingOilFormGroup(): FormGroup {
    return new FormGroup({
      selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
        FormSelectValidatorSwitcher({ onlyFormGroups: true }),
      ]),
      isoVgClass: new FormGroup({
        isoVgClass: new FormControl<number>(undefined, [Validators.required]),
      }),
      viscosity: new FormGroup(
        {
          ny40: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_40')
          ),
          ny100: new FormControl<number>(
            undefined,
            Validators.required,
            this.productSelectionFacade.templateValidator('IDL_NY_100')
          ),
        },
        viscosityGroupValidators()
      ),
      oilFlow: new FormControl<number>(undefined, [
        Validators.required,
        Validators.max(100),
      ]),
      oilTemperatureDifference: new FormControl<number>(
        undefined,
        increaseInOilTempValidators
      ),
      externalHeatFlow: new FormControl<number>(
        undefined,
        externalHeatFlowValidators
      ),
    });
  }

  private createEnergySourceFormGroup(): FormGroup {
    return new FormGroup({
      type: new FormControl<'fossil' | 'electric'>(undefined, [
        FormSelectValidatorSwitcher(),
      ]),
      fossil: new FormGroup({
        fossilOrigin: new FormControl<
          CalculationParametersEnergySource['fossil']['fossilOrigin']
        >(undefined, [Validators.required]),
      }),
      electric: new FormGroup({
        electricityRegion: new FormControl<
          CalculationParametersEnergySource['electric']['electricityRegion']
        >(undefined, [Validators.required]),
      }),
    });
  }
}
