import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { RestService } from '@lsa/core/services/rest.service';
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
import { Unitset } from '@lsa/shared/models/preferences.model';
import { LsaLengthPipe } from '@lsa/shared/pipes/units/length.pipe';
import { mlToFlz } from '@lsa/shared/pipes/units/unit-conversion.helper';

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

  public pipeLengthOptions = signal<{ value: PipeLength; name: string }[]>([]);

  public lubricationIntervalOptions: {
    value: RelubricationInterval;
    name: string;
    templateRef: string;
  }[] = [];

  public optimeOptions: { value: Optime; name: string }[] = [];

  protected readonly restService = inject(RestService);
  protected readonly unitset$: Observable<Unitset>;
  protected readonly lengthPipe = inject(LsaLengthPipe);

  private readonly destroyed$ = new Subject<void>();
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    this.unitset$ = toObservable(this.restService.unitset);
  }

  ngOnInit(): void {
    this.fetchLubricationPointsOptions();
    this.handlePipeLengths();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected convertMlToFloz(ml: number) {
    return mlToFlz(ml).toFixed(1);
  }

  /**
   *  be careful with moving subcription to view as did not work fully correctly with refresh form functionalality.
   *  selection were highlited with selection but controls not selected.
   * */
  private fetchLubricationPointsOptions(): void {
    combineLatest([
      this.getOptimeOptions(),
      this.getLubricationIntervalOptions(),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([optimeOptions, lubricationOptions]) => {
        this.optimeOptions = optimeOptions;
        this.lubricationIntervalOptions = lubricationOptions;
      });
  }

  private handlePipeLengths(): void {
    this.unitset$
      .pipe(
        takeUntil(this.destroyed$),
        switchMap((unitset) => {
          const unitSuffix = unitset === Unitset.SI ? '' : 'Imperial';

          return combineLatest([
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.directMontage`
            ),
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.lessThan${unitSuffix}`,
              {
                value: this.lengthPipe.transform(0.5, unitset),
              }
            ),
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.lessThan${unitSuffix}`,
              {
                value: this.lengthPipe.transform(1, unitset),
              }
            ),
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.between${unitSuffix}`,
              {
                from: this.lengthPipe.transform(1, unitset),
                to: this.lengthPipe.transform(3, unitset),
              }
            ),
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.between${unitSuffix}`,
              {
                from: this.lengthPipe.transform(3, unitset),
                to: this.lengthPipe.transform(5, unitset),
              }
            ),
            this.translocoService.selectTranslate(
              `${PIPE_LENGTH_PATH}.between${unitSuffix}`,
              {
                from: this.lengthPipe.transform(5, unitset),
                to: this.lengthPipe.transform(10, unitset),
              }
            ),
          ]);
        }),
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
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((options) => this.pipeLengthOptions.set(options));
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
