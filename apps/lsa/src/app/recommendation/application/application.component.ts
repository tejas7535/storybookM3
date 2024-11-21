import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { PowerSupply } from '@lsa/shared/constants';
import { ApplicationForm } from '@lsa/shared/models';

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
  ],
  templateUrl: './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {
  @Input()
  public applicationForm: FormGroup<ApplicationForm>;

  public readonly minTemperature = -15;
  public readonly maxTemperature = 70;

  public readonly powerSupplyRadioOptions: {
    value: PowerSupply;
    name: string;
  }[] = [
    {
      value: PowerSupply.External,
      name: this.translateOption('external'),
    },
    {
      value: PowerSupply.Battery,
      name: this.translateOption('battery'),
    },
    {
      value: PowerSupply.NoPreference,
      name: this.translateOption('noPreference'),
    },
  ];

  private translateOption(option: string): string {
    const translationPath = `${translatePath}.powerOptions.${option}`;

    return translate(translationPath);
  }
}
