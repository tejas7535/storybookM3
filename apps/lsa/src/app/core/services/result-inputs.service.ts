import { Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { combineLatest, map, Observable, of, switchMap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LubricantType, PowerSupply } from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ErrorResponse,
  LubricantFormValue,
  RecommendationFormValue,
  RecommendationResponse,
} from '@lsa/shared/models';
import { Unitset } from '@lsa/shared/models/preferences.model';
import {
  LubricationInput,
  ResultInputModel,
} from '@lsa/shared/models/result-inputs.model';
import { LsaLengthPipe } from '@lsa/shared/pipes/units/length.pipe';
import { LsaTemperaturePipe } from '@lsa/shared/pipes/units/temperature.pipe';
import { mlToFlz } from '@lsa/shared/pipes/units/unit-conversion.helper';

import { RestService } from './rest.service';

const TRANSLATIONS = {
  applicationTitle: 'pages.application.title',
  temperatureTitle: 'inputs.temperature.title',
  temperatureValue: 'inputs.temperature.value',
  temperatureValueImperial: 'inputs.temperature.valueImperial',
  powerSupplyTitle: 'inputs.powerSupplyTitle',
  maxPipeLength: 'inputs.maxPipeLengthTitle',
  optimeTitle: 'inputs.optimeTitle',
  lubricantTitle: 'pages.lubricant.title',
  lubricationPointsTitle: 'pages.lubricationPoints.title',
  numberLubricationPoints: 'inputs.lubricationPoints',
  lubricationOptions: 'recommendation.lubrication.options',
  lubricationPointsInterval: 'recommendation.lubricationPoints',
  lubricationPointsOptime: 'recommendation.lubricationPoints.optime',
  relubricationQuantityTitle: 'inputs.relubricationQuantity.title',
  relubricationQuantityValue: 'inputs.relubricationQuantity.value',
  relubricationQuantityValueImerpial:
    'inputs.relubricationQuantity.valueImperial',
  powerExternalOption: 'recommendation.application.powerOptions.external',
  powerBatteryOption: 'recommendation.application.powerOptions.battery',
  powerNoPreferenceOption:
    'recommendation.application.powerOptions.noPreference',
};

const PIPE_LENGTH_PATH = 'recommendation.lubricationPoints.pipeLengthOptions';

@Injectable({
  providedIn: 'root',
})
export class ResultInputsService {
  unit: Observable<Unitset>;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly lengthPipe: LsaLengthPipe,
    private readonly temperaturePipe: LsaTemperaturePipe
  ) {
    this.unit = toObservable(this.restService.unitset);
  }

  public getResultInputs(form: RecommendationFormValue): ResultInputModel {
    return {
      sections: [
        {
          title$: this.translate(TRANSLATIONS.lubricationPointsTitle),
          stepIndex: 0,
          inputs$: this.getLubricationPointsInputs(form),
        },
        {
          title$: this.translate(TRANSLATIONS.lubricantTitle),
          stepIndex: 1,
          inputs$: this.getLubricantInputs(form),
        },
        {
          title$: this.translate(TRANSLATIONS.applicationTitle),
          stepIndex: 2,
          inputs$: this.getApplicationInputs(form),
        },
      ],
    };
  }

  public getPipeLengthTranslation(
    pipeLength: PipeLength,
    unitset = Unitset.SI
  ): Observable<string> {
    const unitsetSuffix = unitset === Unitset.SI ? '' : 'Imperial';

    switch (pipeLength) {
      case PipeLength.Direct:
        return this.translate(`${PIPE_LENGTH_PATH}.directMontage`);
      case PipeLength.HalfMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.lessThan${unitsetSuffix}`, {
          value: this.lengthPipe.transform(0.5, unitset),
        });
      case PipeLength.Meter:
        return this.translate(`${PIPE_LENGTH_PATH}.lessThan${unitsetSuffix}`, {
          value: this.lengthPipe.transform(1, unitset),
        });
      case PipeLength.OneToThreeMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between${unitsetSuffix}`, {
          from: this.lengthPipe.transform(1, unitset),
          to: this.lengthPipe.transform(3, unitset),
        });
      case PipeLength.ThreeToFiveMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between${unitsetSuffix}`, {
          from: this.lengthPipe.transform(3, unitset),
          to: this.lengthPipe.transform(5, unitset),
        });
      case PipeLength.FiveTotenMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between${unitsetSuffix}`, {
          from: this.lengthPipe.transform(5, unitset),
          to: this.lengthPipe.transform(10, unitset),
        });
      default:
        return of('unknown');
    }
  }

  private getLubricationPointsInputs(
    form: RecommendationFormValue
  ): Observable<LubricationInput[]> {
    const {
      lubricationPoints,
      lubricationQty,
      lubricationInterval,
      pipeLength,
      optime,
    } = form.lubricationPoints;

    return this.unit.pipe(
      switchMap((unitset) =>
        combineLatest([
          this.translate(TRANSLATIONS.numberLubricationPoints),
          this.translate(TRANSLATIONS.relubricationQuantityTitle),
          this.translate(
            `${TRANSLATIONS.lubricationPointsInterval}.${lubricationInterval}`
          ),
          this.translate(TRANSLATIONS.maxPipeLength),
          this.getPipeLengthTranslation(pipeLength, unitset),
          this.translate(TRANSLATIONS.optimeTitle),
          this.translate(`${TRANSLATIONS.lubricationPointsOptime}.${optime}`),
          this.restService.recommendation$,
          this.unit,
        ]).pipe(
          map(
            ([
              lubricationPointsTitle,
              relubricationQuantityTitle,
              relubricationIntervalValue,
              maxPipeLengthTitle,
              pipeLengthTranslation,
              optimeTitle,
              optimeValue,
              recommendations,
              selectedUnitset,
            ]) => {
              const recommendationResult = this.isErrorResponse(recommendations)
                ? undefined
                : recommendations.input;

              let remoteOptimeValue;

              if (recommendationResult) {
                remoteOptimeValue = this.translocoService.translate(
                  `${TRANSLATIONS.lubricationPointsOptime}.${recommendationResult.optime}`
                );
              }

              const relubricationQuantityValue =
                this.translocoService.translate(
                  unitset === Unitset.SI
                    ? TRANSLATIONS.relubricationQuantityValue
                    : TRANSLATIONS.relubricationQuantityValueImerpial,
                  {
                    quantity:
                      selectedUnitset === Unitset.SI
                        ? lubricationQty
                        : mlToFlz(lubricationQty).toFixed(2),
                    interval: relubricationIntervalValue,
                  }
                );

              return [
                {
                  title: lubricationPointsTitle,
                  value: lubricationPoints,
                },
                {
                  title: relubricationQuantityTitle,
                  value: relubricationQuantityValue,
                },
                {
                  title: maxPipeLengthTitle,
                  value: pipeLengthTranslation,
                },
                {
                  title: optimeTitle,
                  value: optimeValue,
                  remoteValue: remoteOptimeValue || optimeValue,
                },
              ];
            }
          )
        )
      )
    );
  }

  private isErrorResponse(
    recommendations: RecommendationResponse | ErrorResponse
  ): recommendations is ErrorResponse {
    return (recommendations as ErrorResponse).message !== undefined;
  }

  private getLubricantInputs(
    form: RecommendationFormValue
  ): Observable<LubricationInput[]> {
    return combineLatest([
      this.translate(TRANSLATIONS.lubricantTitle),
      this.getLubricantTypeValue(form.lubricant),
    ]).pipe(
      map(([lubricantTitle, lubricantValue]) => [
        {
          title: lubricantTitle,
          value: lubricantValue,
        },
      ])
    );
  }

  private getLubricantTypeValue(
    formValue: LubricantFormValue
  ): Observable<string> {
    const { lubricantType, grease } = formValue;

    return lubricantType === LubricantType.Arcanol
      ? of(grease.title)
      : this.translate(
          `${TRANSLATIONS.lubricationOptions}.${lubricantType.toLowerCase()}`
        );
  }

  private getApplicationInputs(
    form: RecommendationFormValue
  ): Observable<LubricationInput[]> {
    const { application } = form;
    const { temperature, battery } = application;

    return this.unit.pipe(
      switchMap((unit) =>
        combineLatest([
          this.translate(TRANSLATIONS.temperatureTitle),
          this.translate(
            unit === Unitset.SI
              ? TRANSLATIONS.temperatureValue
              : TRANSLATIONS.temperatureValueImperial,
            {
              min: this.temperaturePipe.transform(temperature.min, unit),
              max: this.temperaturePipe.transform(temperature.max, unit),
            }
          ),
          this.translate(TRANSLATIONS.powerSupplyTitle),
          this.getPowerSupplyRadioOptions().pipe(
            map(
              (options) =>
                options.find((option) => option.value === battery)?.name
            )
          ),
        ]).pipe(
          map(
            ([temperatureTitle, temperatureValue, powerTitle, powerValue]) => [
              {
                title: temperatureTitle,
                value: temperatureValue,
              },
              {
                title: powerTitle,
                value: powerValue,
              },
            ]
          )
        )
      )
    );
  }

  private getPowerSupplyRadioOptions(): Observable<
    { value: PowerSupply; name: string }[]
  > {
    return combineLatest([
      this.translate(TRANSLATIONS.powerExternalOption),
      this.translate(TRANSLATIONS.powerBatteryOption),
      this.translate(TRANSLATIONS.powerNoPreferenceOption),
    ]).pipe(
      map(([externalOption, batteryOption, noPreferenceOption]) => [
        {
          value: PowerSupply.External,
          name: externalOption,
        },
        {
          value: PowerSupply.Battery,
          name: batteryOption,
        },
        {
          value: PowerSupply.NoPreference,
          name: noPreferenceOption,
        },
      ])
    );
  }

  private translate(key: string, params?: object): Observable<string> {
    return this.translocoService.selectTranslate(key, params);
  }
}
