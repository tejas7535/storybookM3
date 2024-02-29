import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { RadioOptionContentDirective } from '@lsa/shared/components/radio-button-group/radio-option-content.directive';
import { Optime, RelubricationInterval } from '@lsa/shared/constants';
import { LubricationPointsForm } from '@lsa/shared/models';
import { translate, TranslocoModule } from '@ngneat/transloco';

const translatePath = 'recommendation.lubricationPoints';

@Component({
  selector: 'lsa-lubrication-points',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonGroupComponent,
    TranslocoModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule,
    RadioOptionContentDirective,
  ],
  templateUrl: './lubrication-points.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LubricationPointsComponent {
  @Input()
  public readonly lubricationPointsForm: FormGroup<LubricationPointsForm>;

  public readonly lubricationIntervalOptions: {
    value: RelubricationInterval;
    name: string;
    templateRef: string;
  }[] = [
    {
      value: RelubricationInterval.Year,
      name: translate(`${translatePath}.perRelubricationInterval`, {
        interval: translate(`${translatePath}.${RelubricationInterval.Year}`),
      }),
      templateRef: 'lubricationQuantity',
    },
    {
      value: RelubricationInterval.Month,
      name: translate(`${translatePath}.perRelubricationInterval`, {
        interval: translate(`${translatePath}.${RelubricationInterval.Month}`),
      }),
      templateRef: 'lubricationQuantity',
    },
    {
      value: RelubricationInterval.Day,
      name: translate(`${translatePath}.perRelubricationInterval`, {
        interval: translate(`${translatePath}.${RelubricationInterval.Day}`),
      }),
      templateRef: 'lubricationQuantity',
    },
  ];

  public readonly lubricationQuantityOptions: number[] = [
    10, 25, 50, 60, 100, 125,
  ];

  public readonly optimeOptions: {
    value: Optime;
    name: string;
  }[] = [
    {
      value: Optime.Yes,
      name: translate(`${translatePath}.optime.${Optime.Yes}`),
    },
    {
      value: Optime.No,
      name: translate(`${translatePath}.optime.${Optime.No}`),
    },
    {
      value: Optime.NoPreference,
      name: translate(`${translatePath}.optime.${Optime.NoPreference}`),
    },
  ];
}
