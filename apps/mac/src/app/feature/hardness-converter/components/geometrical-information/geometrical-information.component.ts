import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, formatNumber } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule,
} from '@angular/material/legacy-snack-bar';

import {
  BehaviorSubject,
  filter,
  ObservableInput,
  ReplaySubject,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { translate } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import * as util from '@mac/feature/hardness-converter/util';
import { SharedModule } from '@mac/shared/shared.module';

import {
  INDENTATION_CONFIG,
  SupportedFormFields,
  SupportedUnits,
} from '../../constants/indentation-config';
import {
  IndentationMaterial,
  IndentationRequestForm,
  IndentationResponse,
} from '../../models';
import { HardnessConverterApiService } from '../../services/hardness-converter-api.service';

@Component({
  selector: 'mac-geometrical-information',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    PushModule,
    LetModule,
    MatLegacySnackBarModule,
    ClipboardModule,
    ReactiveFormsModule,
    SharedModule,
    SharedTranslocoModule,
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
  public diameterBallControl = new FormControl<number>(
    undefined,
    Validators.required
  );
  public loadControl = new FormControl<number>(undefined, Validators.required);
  public valueControl = new FormControl<number>(undefined, Validators.required);
  public thicknessControl = new FormControl<number>(
    undefined,
    Validators.required
  );
  public materialControl = new FormControl<IndentationMaterial>(
    undefined,
    Validators.required
  );

  public isEnabled = false;
  public indentationResult$ = new ReplaySubject<IndentationResponse>();
  public resultLoading$ = new BehaviorSubject<boolean>(false);
  public getErrorMessage = util.getErrorMessage;

  private inputs: FormGroup<IndentationRequestForm>;
  private conversionUnit: string;
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly hardnessService: HardnessConverterApiService,
    @Inject(LOCALE_ID) private readonly locale: string
  ) {}

  ngOnInit(): void {
    this.inputs = new FormGroup<IndentationRequestForm>({
      value: this.valueControl,
      diameter: this.diameterControl,
      diameterBall: this.diameterBallControl,
      load: this.loadControl,
      thickness: this.thicknessControl,
      material: this.materialControl,
    });

    // react to changes of the conversion unit and value
    this.activeConversion.pipe(takeUntil(this.destroy$)).subscribe((data) => {
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
            this.isEnabled &&
            this.inputs.valid &&
            SupportedUnits.includes(this.conversionUnit)
        )
      )
      .subscribe((data) => {
        this.resultLoading$.next(true);
        this.hardnessService
          .getIndentation(
            {
              diameter: data.diameter || data.diameterBall,
              load: data.load,
              material: data.material,
              thickness: data.thickness,
              value: data.value,
            },
            this.conversionUnit,
            (err) => this.errorHandler(err)
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

  public get(response: IndentationResponse, key: keyof IndentationResponse) {
    const val = response[key];

    return typeof val === 'number'
      ? formatNumber(val as number, this.locale, '1.2')
      : val;
  }

  public getGeoKeys() {
    return INDENTATION_CONFIG[this.conversionUnit]?.geometry.columns;
  }
  public getGeoKeysUnit() {
    return INDENTATION_CONFIG[this.conversionUnit]?.geometry.unit;
  }
  public hasCorrectedKeys() {
    return !!INDENTATION_CONFIG[this.conversionUnit]?.correction;
  }
  public getCorrectedKeys() {
    return INDENTATION_CONFIG[this.conversionUnit]?.correction?.columns;
  }
  public getCorrectedKeysUnit() {
    return INDENTATION_CONFIG[this.conversionUnit]?.correction?.unit;
  }
  public hasOther() {
    return !!INDENTATION_CONFIG[this.conversionUnit]?.other;
  }
  public getOther() {
    return INDENTATION_CONFIG[this.conversionUnit]?.other?.columns;
  }
  public getOtherUnit() {
    return INDENTATION_CONFIG[this.conversionUnit]?.other?.unit;
  }

  public onCopyButtonClick(value: any, unit: any): void {
    this.clipboard.copy(`${value}\u00A0${unit}`);
    this.snackbar.open(translate('hardnessConverter.clipboardcopy'), 'X', {
      duration: 2500,
    });
  }

  public setFocus() {
    // Timeout will somehow refresh all components, otherwise focus change is not applied to the application
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 0);
  }

  private errorHandler(err: HttpErrorResponse): ObservableInput<any> {
    this.snackbar.open(
      translate(`hardnessConverter.geometricalInformation.error.${err.status}`),
      'X',
      {
        duration: 5000,
      }
    );

    return [];
  }

  private reset() {
    this.inputs.reset({}, { emitEvent: false });
    this.resetResult();
  }

  private resetResult() {
    this.indentationResult$.next(undefined as IndentationResponse);
  }
}
