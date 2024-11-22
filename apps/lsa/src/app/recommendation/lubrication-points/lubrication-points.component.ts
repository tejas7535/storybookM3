import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { RadioOptionContentDirective } from '@lsa/shared/components/radio-button-group/radio-option-content.directive';
import {
  LubricationPoints,
  Optime,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import { LubricationPointsForm } from '@lsa/shared/models';

const translatePath = 'recommendation.lubricationPoints';
const PIPE_LENGTH_PATH = `${translatePath}.pipeLengthOptions`;

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
    InfoTooltipComponent,
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

  public readonly pipeLengthOptions: { value: PipeLength; name: string }[] = [
    {
      value: PipeLength.Direct,
      name: translate(`${PIPE_LENGTH_PATH}.directMontage`),
    },
    {
      value: PipeLength.HalfMeter,
      name: translate(`${PIPE_LENGTH_PATH}.lessThan`, { value: 0.5 }),
    },
    {
      value: PipeLength.Meter,
      name: translate(`${PIPE_LENGTH_PATH}.lessThan`, { value: 1 }),
    },
    {
      value: PipeLength.OneToThreeMeter,
      name: translate(`${PIPE_LENGTH_PATH}.between`, { from: 1, to: 3 }),
    },
    {
      value: PipeLength.ThreeToFiveMeter,
      name: translate(`${PIPE_LENGTH_PATH}.between`, { from: 3, to: 5 }),
    },
    {
      value: PipeLength.FiveTotenMeter,
      name: translate(`${PIPE_LENGTH_PATH}.between`, { from: 5, to: 10 }),
    },
  ];
}
