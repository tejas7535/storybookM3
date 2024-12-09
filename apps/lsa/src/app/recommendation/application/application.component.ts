import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { PowerSupply } from '@lsa/shared/constants';
import { ApplicationForm } from '@lsa/shared/models';
import { PushPipe } from '@ngrx/component';

const translatePath = 'recommendation.application';

@Component({
  selector: 'lsa-application',
  standalone: true,
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
  ],
  templateUrl: './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {
  @Input()
  public applicationForm: FormGroup<ApplicationForm>;

  public readonly minTemperature = -15;
  public readonly maxTemperature = 70;

  constructor(private readonly translocoService: TranslocoService) {}

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
}
