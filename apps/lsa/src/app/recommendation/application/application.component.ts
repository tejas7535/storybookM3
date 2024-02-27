import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { PowerSupply } from '@lsa/shared/constants';
import { ApplicationForm } from '@lsa/shared/models';
import { translate, TranslocoModule } from '@ngneat/transloco';

const translatePath = 'recommendation.application';

@Component({
  selector: 'lsa-application',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonGroupComponent,
    TranslocoModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {
  @Input()
  public applicationForm: FormGroup<ApplicationForm>;

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
