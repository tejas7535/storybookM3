import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RestService } from '@lsa/core/services/rest.service';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { PowerSupply } from '@lsa/shared/constants';
import { ApplicationForm } from '@lsa/shared/models';
import { Unitset } from '@lsa/shared/models/preferences.model';
import { PushPipe } from '@ngrx/component';

import { TemperatureInputComponent } from './temperature-input/temperature-input.component';

const translatePath = 'recommendation.application';

@Component({
  selector: 'lsa-application',
  imports: [
    RadioButtonGroupComponent,
    TranslocoModule,
    MatDividerModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    InfoTooltipComponent,
    PushPipe,
    CommonModule,
    TemperatureInputComponent,
  ],
  templateUrl: './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {
  @Input()
  public applicationForm: FormGroup<ApplicationForm>;

  public readonly minTemperature = -15;
  public readonly maxTemperature = 70;

  public unitset = Unitset.SI;
  public unitset$ = this.restService.unitset;

  protected formUpdateSignal: Signal<Partial<ApplicationForm>>;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService
  ) {}

  public get powerSupplyRadioOptions(): Observable<
    { value: PowerSupply; name: string }[]
  > {
    return combineLatest([
      this.translocoService.selectTranslate(
        `${translatePath}.powerOptions.external`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.powerOptions.battery`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.powerOptions.noPreference`
      ),
    ]).pipe(
      map(([external, battery, noPreference]) => [
        {
          value: PowerSupply.External,
          name: external,
        },
        {
          value: PowerSupply.Battery,
          name: battery,
        },
        {
          value: PowerSupply.NoPreference,
          name: noPreference,
        },
      ])
    );
  }

  protected handleTemperatureUpdate(bounds: { min: number; max: number }) {
    this.applicationForm.controls.temperature.patchValue({
      min: bounds.min,
      max: bounds.max,
      title: this.applicationForm.controls.temperature.value.title,
    });
  }
}
