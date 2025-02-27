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

  onMinTemperatureChange(event: Event) {
    let value = this.getInputValue(event);
    const temperature = this.applicationForm.get('temperature');

    const maxValue = temperature.value.max;

    value = value < this.minTemperature ? this.minTemperature : value;
    value = value > maxValue ? maxValue : value;

    this.setInputValue(event, value);
    temperature.value.min = value;
  }

  onMaxTemperatureChange(event: Event) {
    let value = this.getInputValue(event);
    const temperature = this.applicationForm.get('temperature');

    const minValue = temperature.value.min;

    value = value > this.maxTemperature ? this.maxTemperature : value;
    value = value < minValue ? minValue : value;

    this.setInputValue(event, value);
    temperature.value.max = value;
  }

  private getInputValue(event: Event): number {
    const inputElement = event.target as HTMLInputElement;

    return Number.parseFloat(inputElement.value);
  }

  private setInputValue(event: Event, value: number): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = value.toString();
  }
}
