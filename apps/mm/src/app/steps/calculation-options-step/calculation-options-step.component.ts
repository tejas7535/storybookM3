import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  getMountingOptions,
  getNumberOfPreviousMountingOptions,
  getShaftMaterialsOptions,
} from './calculation-selection.options';
import {
  CalculationOptionsFormData,
  HyndraulicNutTypeOption,
  MountingSelectOption,
  PreviousMountingOption,
  ShaftMaterialOption,
} from './calculation-selection-step.interface';

@Component({
  selector: 'mm-calculation-options-step',
  templateUrl: './calculation-options-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedTranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    LoadingSpinnerModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class CalculationOptionsStepComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() preflightData?: PreflightData;

  public destroy$ = new Subject<void>();

  public readonly innerRingExpansionType = 'LB_INNER_RING_EXPANSION';

  public form = new FormGroup({
    hydraulicNutType: new FormControl('', Validators.required),
    previousMountingOption: new FormControl('', Validators.required),
    mountingOption: new FormControl('', Validators.required),
    innerRingExpansion: new FormControl('', Validators.required),
    radialClearanceReduction: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    shaftDiameter: new FormControl('', Validators.required),
    shaftMaterial: new FormControl('', Validators.required),
    modulusOfElasticity: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    poissonRatio: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
  });

  public previousMountingNumberOptions: Signal<PreviousMountingOption[]>;
  public mountingOptions: Signal<MountingSelectOption[]>;
  public shaftMaterialOptions: Signal<ShaftMaterialOption[]>;
  public hydraulicNutTypeOptions: Signal<HyndraulicNutTypeOption[]>;

  public readonly preflightData$: Observable<PreflightData> =
    this.calculationOptionsFacade.options$;

  public isLoading = toSignal(this.calculationResultFacade.isLoading$);

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly calculationOptionsFacade: CalculationOptionsFacade,
    private readonly calculationResultFacade: CalculationResultFacade
  ) {
    this.previousMountingNumberOptions = toSignal(
      getNumberOfPreviousMountingOptions(this.translocoService)
    );

    this.mountingOptions = toSignal(getMountingOptions(this.translocoService));
    this.shaftMaterialOptions = toSignal(
      getShaftMaterialsOptions(this.translocoService)
    );
  }

  ngOnChanges(): void {
    if (this.preflightData) {
      this.form.patchValue({
        innerRingExpansion: this.preflightData.innerRingExpansion,
        radialClearanceReduction: this.preflightData.radialClearanceReduction,
        shaftDiameter: this.preflightData.shaftDiameter,
        shaftMaterial: this.preflightData.shaftMaterial,
        modulusOfElasticity: this.preflightData.modulusOfElasticity,
        poissonRatio: this.preflightData.poissonRatio,
        hydraulicNutType: this.preflightData.hudraulicNutType.value,
        previousMountingOption: this.preflightData.numberOfPreviousMountings,
        mountingOption: this.preflightData.mountingOption,
      });

      if (this.preflightData.hudraulicNutType) {
        this.hydraulicNutTypeOptions = signal(
          this.preflightData.hudraulicNutType.options
        );
      }
    }
  }

  ngOnInit(): void {
    this.form
      .get('mountingOption')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === this.innerRingExpansionType) {
          this.form.get('innerRingExpansion')?.enable();
          this.form.get('radialClearanceReduction')?.disable();
        } else {
          this.form.get('radialClearanceReduction')?.enable();
          this.form.get('innerRingExpansion')?.disable();
        }
      });

    this.form
      .get('shaftMaterial')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.calculationOptionsFacade.updateShaftMaterialInfomration(value);
      });

    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.form.valid) {
          const formValues: Partial<CalculationOptionsFormData> =
            this.form.value;
          this.calculationOptionsFacade.updateFormData(
            formValues as CalculationOptionsFormData
          );
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.calculationResultFacade.calculateResultFromForm();
    }
  }
}
