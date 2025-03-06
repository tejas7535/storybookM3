import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import {
  combineLatest,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
export class LubricationPointsComponent implements OnInit, OnDestroy {
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
      value: LubricationPoints.EightOrMore,
      name: LubricationPoints.EightOrMore,
    },
  ];

  public readonly lubricationQuantityOptions: number[] = [
    10, 25, 50, 60, 100, 125,
  ];

  public pipeLengthOptions: { value: PipeLength; name: string }[] = [];

  public lubricationIntervalOptions: {
    value: RelubricationInterval;
    name: string;
    templateRef: string;
  }[] = [];

  public optimeOptions: { value: Optime; name: string }[] = [];

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.fetchLubricationPointsOptions();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   *  be careful with moving subcription to view as did not work fully correctly with refresh form functionalality.
   *  selection were highlited with selection but controls not selected.
   * */
  private fetchLubricationPointsOptions(): void {
    combineLatest([
      this.getOptimeOptions(),
      this.getPipeLengthOptions(),
      this.getLubricationIntervalOptions(),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([optimeOptions, pipeOptions, lubricationOptions]) => {
        this.optimeOptions = optimeOptions;
        this.pipeLengthOptions = pipeOptions;
        this.lubricationIntervalOptions = lubricationOptions;
      });
  }

  private getPipeLengthOptions(): Observable<
    { value: PipeLength; name: string }[]
  > {
    return combineLatest([
      this.translocoService.selectTranslate(
        `${PIPE_LENGTH_PATH}.directMontage`
      ),
      this.translocoService.selectTranslate(`${PIPE_LENGTH_PATH}.lessThan`, {
        value: 0.5,
      }),
      this.translocoService.selectTranslate(`${PIPE_LENGTH_PATH}.lessThan`, {
        value: 1,
      }),
      this.translocoService.selectTranslate(`${PIPE_LENGTH_PATH}.between`, {
        from: 1,
        to: 3,
      }),
      this.translocoService.selectTranslate(`${PIPE_LENGTH_PATH}.between`, {
        from: 3,
        to: 5,
      }),
      this.translocoService.selectTranslate(`${PIPE_LENGTH_PATH}.between`, {
        from: 5,
        to: 10,
      }),
    ]).pipe(
      map(
        ([
          directMontage,
          lessThanHalfMeter,
          lessThanMeter,
          oneToThreeMeter,
          threeToFiveMeter,
          fiveToTenMeter,
        ]) => [
          {
            value: PipeLength.Direct,
            name: directMontage,
          },
          {
            value: PipeLength.HalfMeter,
            name: lessThanHalfMeter,
          },
          {
            value: PipeLength.Meter,
            name: lessThanMeter,
          },
          {
            value: PipeLength.OneToThreeMeter,
            name: oneToThreeMeter,
          },
          {
            value: PipeLength.ThreeToFiveMeter,
            name: threeToFiveMeter,
          },
          {
            value: PipeLength.FiveTotenMeter,
            name: fiveToTenMeter,
          },
        ]
      )
    );
  }

  private getLubricationIntervalOptions(): Observable<
    {
      value: RelubricationInterval;
      name: string;
      templateRef: string;
    }[]
  > {
    return combineLatest([
      this.translocoService
        .selectTranslate(`${translatePath}.${RelubricationInterval.Year}`)
        .pipe(
          switchMap((year) =>
            this.translocoService.selectTranslate(
              `${translatePath}.perRelubricationInterval`,
              { interval: year }
            )
          )
        ),
      this.translocoService
        .selectTranslate(`${translatePath}.${RelubricationInterval.Month}`)
        .pipe(
          switchMap((month) =>
            this.translocoService.selectTranslate(
              `${translatePath}.perRelubricationInterval`,
              { interval: month }
            )
          )
        ),
      this.translocoService
        .selectTranslate(`${translatePath}.${RelubricationInterval.Day}`)
        .pipe(
          switchMap((day) =>
            this.translocoService.selectTranslate(
              `${translatePath}.perRelubricationInterval`,
              { interval: day }
            )
          )
        ),
    ]).pipe(
      map(([year, month, day]) => [
        {
          value: RelubricationInterval.Year,
          name: year,
          templateRef: 'lubricationQuantity',
        },
        {
          value: RelubricationInterval.Month,
          name: month,
          templateRef: 'lubricationQuantity',
        },
        {
          value: RelubricationInterval.Day,
          name: day,
          templateRef: 'lubricationQuantity',
        },
      ])
    );
  }

  private getOptimeOptions(): Observable<{ value: Optime; name: string }[]> {
    return combineLatest([
      this.translocoService.selectTranslate(
        `${translatePath}.optime.${Optime.Yes}`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.optime.${Optime.No}`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.optime.${Optime.NoPreference}`
      ),
    ]).pipe(
      map(([yes, no, noPreference]) => [
        {
          value: Optime.Yes,
          name: yes,
        },
        {
          value: Optime.No,
          name: no,
        },
        {
          value: Optime.NoPreference,
          name: noPreference,
        },
      ])
    );
  }
}
