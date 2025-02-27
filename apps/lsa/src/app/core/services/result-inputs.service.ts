import { Injectable } from '@angular/core';

import { combineLatest, map, Observable, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LubricantType, PowerSupply } from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ErrorResponse,
  LubricantFormValue,
  RecommendationFormValue,
  RecommendationResponse,
} from '@lsa/shared/models';
import {
  LubricationInput,
  ResultInputModel,
} from '@lsa/shared/models/result-inputs.model';

import { RestService } from './rest.service';

const TRANSLATIONS = {
  applicationTitle: 'pages.application.title',
  temperatureTitle: 'inputs.temperature.title',
  temperatureValue: 'inputs.temperature.value',
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
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService
  ) {}

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

    return combineLatest([
      this.translate(TRANSLATIONS.numberLubricationPoints),
      this.translate(TRANSLATIONS.relubricationQuantityTitle),
      this.translate(
        `${TRANSLATIONS.lubricationPointsInterval}.${lubricationInterval}`
      ),
      this.translate(TRANSLATIONS.maxPipeLength),
      this.getPipeLengthTranslation(pipeLength),
      this.translate(TRANSLATIONS.optimeTitle),
      this.translate(`${TRANSLATIONS.lubricationPointsOptime}.${optime}`),
      this.restService.recommendation$,
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

          const relubricationQuantityValue = this.translocoService.translate(
            TRANSLATIONS.relubricationQuantityValue,
            {
              quantity: lubricationQty,
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
    );
  }

  private isErrorResponse(
    recommendations: RecommendationResponse | ErrorResponse
  ): recommendations is ErrorResponse {
    return (recommendations as ErrorResponse).message !== undefined;
  }

  private getPipeLengthTranslation(pipeLength: PipeLength): Observable<string> {
    switch (pipeLength) {
      case PipeLength.Direct:
        return this.translate(`${PIPE_LENGTH_PATH}.directMontage`);
      case PipeLength.HalfMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.lessThan`, { value: 0.5 });
      case PipeLength.Meter:
        return this.translate(`${PIPE_LENGTH_PATH}.lessThan`, { value: 1 });
      case PipeLength.OneToThreeMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 1,
          to: 3,
        });
      case PipeLength.ThreeToFiveMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 3,
          to: 5,
        });
      case PipeLength.FiveTotenMeter:
        return this.translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 5,
          to: 10,
        });
      default:
        return of('unknown');
    }
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

    return combineLatest([
      this.translate(TRANSLATIONS.temperatureTitle),
      this.translate(TRANSLATIONS.temperatureValue, {
        min: temperature.min,
        max: temperature.max,
      }),
      this.translate(TRANSLATIONS.powerSupplyTitle),
      this.getPowerSupplyRadioOptions().pipe(
        map(
          (options) => options.find((option) => option.value === battery)?.name
        )
      ),
    ]).pipe(
      map(([temperatureTitle, temperatureValue, powerTitle, powerValue]) => [
        {
          title: temperatureTitle,
          value: temperatureValue,
        },
        {
          title: powerTitle,
          value: powerValue,
        },
      ])
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
