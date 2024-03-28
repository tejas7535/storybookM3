import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { RadioOptionContentDirective } from '@lsa/shared/components/radio-button-group/radio-option-content.directive';
import {
  LubricationPoints,
  Optime,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { LSAInterval, LubricationPointsForm } from '@lsa/shared/models';
import { translate, TranslocoModule } from '@ngneat/transloco';

const translatePath = 'recommendation.lubricationPoints';

interface PipeOption {
  value: LSAInterval;
  name: string;
}

@Component({
  selector: 'lsa-lubrication-points',
  standalone: true,
  imports: [
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

  public readonly lubricationPointsOptions: {
    value: LubricationPoints;
    name: string;
  }[] = [
    {
      value: LubricationPoints.One,
      name: LubricationPoints.One,
    },
    {
      value: LubricationPoints.TwoToFour,
      name: LubricationPoints.TwoToFour,
    },
    {
      value: LubricationPoints.FiveToEight,
      name: LubricationPoints.FiveToEight,
    },
    {
      value: LubricationPoints.NineOrMore,
      name: LubricationPoints.NineOrMore,
    },
  ];

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

  public readonly pipeLengthOptions: PipeOption[] = [
    { min: 0, max: 0 },
    { min: 0, max: 0.5 },
    { min: 0, max: 1 },
    { min: 1, max: 3 },
    { min: 3, max: 5 },
    { min: 5, max: 10 },
  ].map(({ min, max }) => this.createPipeOption(min, max));

  private createPipeOption(min: number, max: number): PipeOption {
    const path = `${translatePath}.pipeLengthOptions`;
    let title = '';

    if (max === 0) {
      title = translate(`${path}.directMontage`);
    } else if (min === 0) {
      title = translate(`${path}.lessThan`, { value: max });
    } else {
      title = translate(`${path}.between`, { from: min, to: max });
    }

    return {
      value: {
        min,
        max,
        title,
      },
      name: title,
    };
  }
}
