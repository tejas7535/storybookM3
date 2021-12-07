/* eslint-disable max-lines */
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
  BurdeningType,
  Display,
  HvLimits,
  PredictionRequest,
  StatisticalRequest,
} from '../models';
import * as fromStore from '../store';
import {
  AbstractControlWarn,
  CustomFormControl,
  InputCategory,
} from './input.model';
import { SelectControl } from './select/select-control.model';
import { SelectControlOption } from './select/select-control-option.model';
import { SliderControl } from './slider/slider.model';
import { ToggleControl } from './toggle/toggle.model';

// TODO: cleanup imports

@Component({
  selector: 'mac-ltp-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  public burdeningTypes: Observable<BurdeningType[]>;
  public predictionRequest: Observable<PredictionRequest>;
  public hardnessControls: CustomFormControl[];
  public materialControls: CustomFormControl[];
  public loadControls: CustomFormControl[];
  public commonControls: CustomFormControl[];
  public inputForm = new FormGroup({});
  public display: Observable<Display>;
  public quality: string;
  public material = false;

  public inputCategories: InputCategory[] = [];

  public constructor(private readonly store: Store) {
    this.predictionRequest = this.store.select(fromStore.getPredictionRequest);
    this.burdeningTypes = this.store.select(fromStore.getBurdeningTypes);
    this.display = this.store.select(fromStore.getDisplay);

    this.createControls();
    this.inputCategories = [
      {
        name: 'display',
        description: 'prediction.display.infoDisplay',
        controls: this.commonControls,
        alwaysVisible: true,
      },
      {
        name: 'hv',
        description: 'prediction.display.infoHv',
        controls: this.hardnessControls,
      },
      {
        name: 'materialParams',
        description: 'prediction.display.infoMaterial',
        controls: this.materialControls,
      },
      {
        name: 'mechanicalLoad',
        description: 'prediction.display.infoLoad',
        controls: this.loadControls,
      },
    ];

    this.inputCategories.forEach((inputCategory) => {
      inputCategory.controls.forEach((control) => {
        this.inputForm.registerControl(control.key, control.formControl);
      });
    });

    this.predictionRequest.subscribe((request: PredictionRequest) =>
      this.patchForm(request)
    );
    this.display.subscribe((request: Display) => this.patchForm(request));
  }

  public ngOnInit(): void {
    this.store.dispatch(fromStore.getFormOptions());

    const displayFormControls = ['showMurakami', 'showFKM', 'showStatistical'];

    // TODO: remove any
    this.inputForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev: any, curr: any) => {
          if (this.inputForm.valid && !this.inputForm.pristine) {
            // eslint-disable-next-line unicorn/no-array-reduce
            const displayFormChange = displayFormControls.reduce(
              (earlier, control) => prev[control] !== curr[control] || earlier,
              false
            );
            if (displayFormChange) {
              this.setDisplay(curr);
            } else if (prev !== curr) {
              this.setPredictionRequest(curr, prev);
            }

            return true;
          }

          return false;
        })
      )
      .subscribe();

    const formControls = this.inputForm.controls;
    formControls['hv'].valueChanges
      .pipe(debounceTime(200))
      .subscribe((selectedHV: number) => {
        if (formControls['hv'].dirty) {
          this.adjustES(formControls['es'], selectedHV);
        }
      });
  }

  /**
   * Prepare and dispatch predictionRequest
   */
  public setPredictionRequest(
    predictionRequestControls: PredictionRequest & Display,
    previousPredicionRequestControls: PredictionRequest & Display
  ): void {
    const { showMurakami, showFKM, showStatistical, ...rest } =
      predictionRequestControls;
    let predictionRequest: PredictionRequest = rest;

    if (previousPredicionRequestControls.hv !== predictionRequestControls.hv) {
      predictionRequest = {
        ...predictionRequest,
        hv_upper: predictionRequestControls.hv,
        hv_lower: predictionRequestControls.hv,
      };
    }

    const statisticalRequest: StatisticalRequest = {
      rz: predictionRequest.rz,
      es: predictionRequest.es,
      rArea: predictionRequest.rArea,
      v90: predictionRequest.v90,
      hardness: predictionRequest.hv,
      r: predictionRequest.rrelation,
      loadingType: predictionRequest.burdeningType,
    };

    this.store.dispatch(
      fromStore.setPredictionRequest({
        predictionRequest,
        statisticalRequest,
      })
    );
  }

  /**
   * Prepare and dispatch setDisplay
   */
  public setDisplay(displayControls: PredictionRequest & Display): void {
    const { showMurakami, showFKM, showStatistical } = displayControls;
    const display: Display = {
      showMurakami,
      showFKM,
      showStatistical,
    };

    this.store.dispatch(fromStore.setDisplay({ display }));
  }

  /**
   * Patches form and sets it on pristine state
   */
  public patchForm(request: any): void {
    // TODO: remove any
    this.inputForm.patchValue(request);
    this.inputForm.markAsPristine();
  }

  /**
   * Adjusts 'Eigenspannung' min and max value and value to half of selected 'Randhärte'
   */
  public adjustES(esFormControls: AbstractControl, selectedHV: number): void {
    const esLimit = Math.round((selectedHV * 0.5) / 10) * 10;

    const esIndex = this.materialControls.findIndex(
      (control) => control.key === 'es'
    );
    this.materialControls[esIndex] = new SliderControl({
      ...this.materialControls[esIndex],
      min: -esLimit,
      max: esLimit,
    });

    if (esFormControls.value > esLimit) {
      esFormControls.patchValue(esLimit);
    }

    if (esFormControls.value < -esLimit) {
      esFormControls.patchValue(-esLimit);
    }
  }

  /**
   * Returns true if the input is of type SliderControl
   */
  public isSlider(control: CustomFormControl): boolean {
    return control instanceof SliderControl;
  }

  /**
   * Returns true if the input is of type SelectControl
   */
  public isSelect(control: CustomFormControl): boolean {
    return control instanceof SelectControl;
  }

  /**
   * Returns true if the input is of type ToggleControl
   */
  public isToggle(control: CustomFormControl): boolean {
    return control instanceof ToggleControl;
  }

  /**
   * Returns true or false depending if toggle is set for manual dropdown
   */
  public dropdownHardness(controlGroupName: string): boolean {
    return controlGroupName === 'hv' && !!this.material;
  }

  /**
   * Returns true or false depending if toggle is set for slider selection
   */
  public sliderHardness(controlGroupName: string): boolean {
    return (
      controlGroupName !== 'hv' || (controlGroupName === 'hv' && !this.material)
    );
  }

  public adjustLimits(limits: HvLimits): void {
    this.store.dispatch(
      fromStore.setPredictionRequest({
        predictionRequest: limits,
        statisticalRequest: limits,
      })
    );
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }

  public validateRRelation(): ValidatorFn {
    return (control: AbstractControlWarn): { [key: string]: any } => {
      const warn = control.value !== -1 && control.value !== 0;
      control.warnings = warn
        ? { validationWarning: { value: control.value, text: 'rrelInfoShort' } }
        : undefined;

      return undefined;
    };
  }

  /**
   * Initializes all control arrays.
   */
  public createControls(): void {
    this.commonControls = [
      new ToggleControl({
        key: 'showMurakami',
        name: 'showMurakami',
        formControl: new FormControl(),
        disabled: false,
        default: false,
      }),
      new ToggleControl({
        key: 'showFKM',
        name: 'showFkm',
        formControl: new FormControl(),
        disabled: false,
        default: false,
      }),
      new ToggleControl({
        key: 'showStatistical',
        name: 'showStatistical',
        formControl: new FormControl(),
        disabled: false,
        default: false,
      }),
      new SliderControl({
        key: 'spreading',
        name: 'slog',
        min: 0,
        max: 0.1,
        step: 0.005,
        disabled: this.predictionRequest.pipe(
          map((req: PredictionRequest) => req.prediction !== 0)
        ),
        formControl: new FormControl(),
      }),
    ];

    this.hardnessControls = [
      new SliderControl({
        key: 'hv',
        name: 'hv',
        min: 180,
        max: 800,
        step: 1,
        disabled: false,
        formControl: new FormControl(),
      }),
    ];

    this.materialControls = [
      new SliderControl({
        key: 'rz',
        name: 'roughness',
        min: 0,
        max: 25,
        step: 0.1,
        disabled: false,
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'hv_core',
        name: 'hvCore',
        min: 180,
        max: 800,
        step: 1,
        disabled: false,
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'rArea',
        name: 'area',
        min: 5,
        max: 100,
        step: 1,
        disabled: false,
        flexibleLabel(label: string): string {
          const addedString =
            this.formControl.value > 15
              ? `${this.formControl.value > 60 ? '(Low-Budget)' : '(Standard)'}`
              : '(TPQ)';

          return label + addedString;
        },
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'es',
        name: 'residualStress',
        min: -90,
        max: 90,
        step: 10,
        disabled: false,
        formControl: new FormControl(),
      }),
    ];

    this.loadControls = [
      new SliderControl({
        key: 'mpa',
        name: 'mpa',
        min: 400,
        max: 1500,
        step: 1,
        disabled: this.predictionRequest.pipe(
          map((req: PredictionRequest) => req.prediction !== 0)
        ),
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'v90',
        name: 'v90',
        min: 1,
        max: 10_000,
        step: 1,
        logarithmic: true,
        disabled: false,
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'gradient',
        name: 'gradient',
        min: 0.001,
        max: 10,
        step: 0.1,
        disabled: true,
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'rrelation',
        name: 'rrel',
        min: -1,
        max: 0.3,
        step: 0.05,
        disabled: false,
        formControl: new FormControl(undefined, [this.validateRRelation()]),
        infoText: 'rrelInfoLong',
      }),
      new SliderControl({
        key: 'a90',
        name: 'a90',
        min: 0.01,
        max: 2000,
        step: 1,
        disabled: true,
        formControl: new FormControl(),
      }),
      new SliderControl({
        key: 'multiaxiality',
        name: 'multiaxiality',
        min: -1.33,
        max: 1.33,
        step: 0.01,
        disabled: true,
        formControl: new FormControl(),
      }),
      new SelectControl({
        key: 'burdeningType',
        name: 'burdeningType',
        options: this.burdeningTypes.pipe(
          map((burdeningTypes: BurdeningType[]) => {
            const options: SelectControlOption[] = [];
            for (const burdeningType of burdeningTypes) {
              options.push(
                new SelectControlOption(burdeningType.id, burdeningType.name)
              );
            }

            return options;
          })
        ),
        disabled: false,
        formControl: new FormControl(),
      }),
    ];
  }
}
