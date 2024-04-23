import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { formatNumber } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  BehaviorSubject,
  filter,
  Observable,
  ReplaySubject,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import * as util from '@hc/util/error-helpers';
import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  INDENTATION_CONFIG,
  IndentationConfigColumn,
  IndentationResetValues,
  IntendationDiameterBallValues,
  IntendationLoadValues,
  SupportedFormFields,
  SupportedUnits,
} from '../../constants/indentation-config';
import {
  IndentationMaterial,
  IndentationRequestForm,
  IndentationResponse,
} from '../../models';
import { HardnessConverterApiService } from '../../services/hardness-converter-api.service';
import { InternalUserCheckService } from '../../services/internal-user-check.service';

@Component({
  selector: 'hc-geometrical-information',
  standalone: true,
  imports: [
    MatIconModule,
    SelectModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    PushPipe,
    LetDirective,
    MatSnackBarModule,
    MatIconModule,
    ClipboardModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './geometrical-information.component.html',
})
export class GeometricalInformationComponent implements OnInit, OnDestroy {
  @Input()
  public inputElement: ElementRef<HTMLInputElement>;

  @Input()
  public activeConversion = new Subject<{
    value: number;
    unit: string;
  }>();

  public diameterControl = new FormControl<number>(
    undefined,
    Validators.required
  );
  public diameterBallControl = new FormControl<{
    diameter: number;
    load: number;
  }>(undefined, Validators.required);
  public loadControl = new FormControl<StringOption>(
    undefined,
    Validators.required
  );
  public valueControl = new FormControl<number>(undefined, Validators.required);
  public thicknessControl = new FormControl<number>(
    undefined,
    Validators.required
  );
  public materialControl = new FormControl<IndentationMaterial>(
    undefined,
    Validators.required
  );

  public enabledControl = new FormControl<boolean>(
    false,
    Validators.requiredTrue
  );

  public indentationResult$ = new ReplaySubject<IndentationResponse>();
  public resultLoading$ = new BehaviorSubject<boolean>(false);
  public isInternal$: Observable<boolean>;
  public getErrorMessage = util.getErrorMessage;

  public loadOptions = IntendationLoadValues;
  public diameterBallOptions = IntendationDiameterBallValues;

  private inputs: FormGroup<IndentationRequestForm>;
  private conversionUnit: string;
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly hardnessService: HardnessConverterApiService,
    private readonly internalUserService: InternalUserCheckService,
    @Inject(LOCALE_ID) private readonly locale: string
  ) {}

  ngOnInit(): void {
    this.inputs = new FormGroup<IndentationRequestForm>({
      enabled: this.enabledControl,
      value: this.valueControl,
      diameter: this.diameterControl,
      diameterBall: this.diameterBallControl,
      load: this.loadControl,
      thickness: this.thicknessControl,
      material: this.materialControl,
    });

    this.isInternal$ = this.internalUserService.isInternalUser();
    // react to changes of the conversion unit and value
    this.activeConversion
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => !!data.unit)
      )
      .subscribe((data) => {
        if (this.conversionUnit !== data.unit) {
          SupportedFormFields.forEach((field) =>
            this.setValidators(data.unit, field as keyof IndentationRequestForm)
          );

          this.conversionUnit = data.unit;
          this.reset();
        }
        // set value on control, update all fields and mark value as touched (to (un)trigger error message)
        this.valueControl.setValue(data.value);
        this.inputs.updateValueAndValidity();
        this.valueControl.markAsTouched();
      });

    // react to changes of properties
    this.inputs.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.resetResult()),
        filter(
          () =>
            this.inputs.valid && SupportedUnits.includes(this.conversionUnit)
        )
      )
      .subscribe((data) => {
        this.resultLoading$.next(true);
        this.hardnessService
          .getIndentation(
            {
              diameter: data.diameter || data.diameterBall?.diameter,
              load: (data.load?.id as number) || data.diameterBall?.load,
              material: data.material,
              thickness: data.thickness || 0,
              value: data.value,
            },
            this.conversionUnit
          )
          .pipe(take(1))
          .subscribe((response) => {
            this.resultLoading$.next(false);
            this.indentationResult$.next(response);
          });
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setValidators(unit: string, key: keyof IndentationRequestForm) {
    this.inputs.controls[key].clearValidators();
    if (INDENTATION_CONFIG[unit]?.formfields[key]) {
      this.inputs.controls[key].enable({ emitEvent: false });
      this.inputs.controls[key].addValidators(
        INDENTATION_CONFIG[unit]?.formfields[key]
      );
    } else {
      this.inputs.controls[key].disable({ emitEvent: false });
    }
  }

  public getMaterials() {
    return Object.keys(IndentationMaterial).filter((item) =>
      Number.isNaN(Number(item))
    );
  }

  public get(response: IndentationResponse, item: IndentationConfigColumn) {
    const val = response[item.name];

    return val ? formatNumber(val as number, this.locale, item.format) : '-';
  }

  // verify that selected unit has a configuration (not for MPa)
  public isValidUnit() {
    return !!INDENTATION_CONFIG[this.conversionUnit];
  }

  public getGeoKeys() {
    return INDENTATION_CONFIG[this.conversionUnit]?.geometry;
  }
  public hasCorrectedKeys() {
    return !!INDENTATION_CONFIG[this.conversionUnit]?.correction;
  }
  public getCorrectedKeys() {
    return INDENTATION_CONFIG[this.conversionUnit]?.correction;
  }
  public hasOther() {
    return !!INDENTATION_CONFIG[this.conversionUnit]?.other;
  }
  public getOther() {
    return INDENTATION_CONFIG[this.conversionUnit]?.other;
  }

  public onCopyButtonClick(value: any, unit: any): void {
    this.clipboard.copy(`${value}\u00A0${unit}`);
    this.snackbar.open(translate('clipboardcopy'), 'X', {
      duration: 2500,
    });
  }

  public setFocus() {
    // Timeout will somehow refresh all components, otherwise focus change is not applied to the application
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 0);
  }

  public onEntryAdded(value: number | string): void {
    const newOption: StringOption = { id: value, title: value.toString() };
    this.loadOptions.push(newOption);
  }

  public filterFn(option?: StringOption, value?: string) {
    return value ? option?.title?.includes(value) : true;
  }

  private reset() {
    const resetValues = {
      ...IndentationResetValues,
      enabled: this.enabledControl.value,
    };
    this.inputs.reset(resetValues, { emitEvent: false });
    this.resetResult();
  }

  private resetResult() {
    this.indentationResult$.next(undefined as IndentationResponse);
  }
}
