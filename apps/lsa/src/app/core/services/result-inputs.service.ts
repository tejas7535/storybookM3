import { Injectable } from '@angular/core';

import { translate, TranslocoService } from '@jsverse/transloco';
import { LubricantType, PowerSupply } from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  LubricantFormValue,
  RecommendationFormValue,
  RecommendationResponse,
} from '@lsa/shared/models';
import {
  LubricationInput,
  ResultInputModel,
} from '@lsa/shared/models/result-inputs.model';

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
  private readonly powerSupplyRadioOptions: {
    value: PowerSupply;
    name: string;
  }[] = [
    {
      value: PowerSupply.External,
      name: TRANSLATIONS.powerExternalOption,
    },
    {
      value: PowerSupply.Battery,
      name: TRANSLATIONS.powerBatteryOption,
    },
    {
      value: PowerSupply.NoPreference,
      name: TRANSLATIONS.powerNoPreferenceOption,
    },
  ];

  constructor(private readonly translocoService: TranslocoService) {}

  public getResultInputs(
    form: RecommendationFormValue,
    remoteInput?: RecommendationResponse['input']
  ): ResultInputModel {
    return {
      sections: [
        {
          title: this.translate(TRANSLATIONS.lubricationPointsTitle),
          stepIndex: 0,
          inputs: this.getLubricationPointsInputs(form, remoteInput),
        },
        {
          title: this.translate(TRANSLATIONS.lubricantTitle),
          stepIndex: 1,
          inputs: this.getLubricantInputs(form),
        },
        {
          title: this.translate(TRANSLATIONS.applicationTitle),
          stepIndex: 2,
          inputs: this.getApplicationInputs(form),
        },
      ],
    };
  }

  private getLubricationPointsInputs(
    form: RecommendationFormValue,
    remote: RecommendationResponse['input']
  ): LubricationInput[] {
    const {
      lubricationPoints,
      lubricationQty,
      lubricationInterval,
      pipeLength,
      optime,
    } = form.lubricationPoints;

    const lubricationPointsTitle = this.translate(
      TRANSLATIONS.numberLubricationPoints
    );
    const relubricationQuantityTitle = this.translate(
      TRANSLATIONS.relubricationQuantityTitle
    );
    const relubricationQuantityValue = this.translate(
      TRANSLATIONS.relubricationQuantityValue,
      {
        quantity: lubricationQty,
        interval: lubricationInterval,
      }
    );
    const maxPipeLengthTitle = this.translate(TRANSLATIONS.maxPipeLength);
    let pipeLenghtTranslation;
    switch (pipeLength) {
      case PipeLength.Direct:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.directMontage`);
        break;
      case PipeLength.HalfMeter:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.lessThan`, {
          value: 0.5,
        });
        break;
      case PipeLength.Meter:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.lessThan`, {
          value: 1,
        });
        break;
      case PipeLength.OneToThreeMeter:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 0,
          to: 3,
        });
        break;
      case PipeLength.ThreeToFiveMeter:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 3,
          to: 5,
        });
        break;
      case PipeLength.FiveTotenMeter:
        pipeLenghtTranslation = translate(`${PIPE_LENGTH_PATH}.between`, {
          from: 5,
          to: 10,
        });
        break;
      default:
        pipeLenghtTranslation = 'unkown';
        break;
    }

    const optimeTitle = this.translate(TRANSLATIONS.optimeTitle);
    const optimeValue = this.translate(
      `${TRANSLATIONS.lubricationPointsOptime}.${optime}`
    );
    const remoteOptime = remote
      ? this.translate(
          `${TRANSLATIONS.lubricationPointsOptime}.${remote.optime}`
        )
      : optimeValue;

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
        value: pipeLenghtTranslation,
      },
      {
        title: optimeTitle,
        value: optimeValue,
        remoteValue: remoteOptime,
      },
    ];
  }

  private getLubricantInputs(
    form: RecommendationFormValue
  ): LubricationInput[] {
    return [
      {
        title: this.translate(TRANSLATIONS.lubricantTitle),
        value: this.getLubricantTypeValue(form.lubricant),
      },
    ];
  }

  private getLubricantTypeValue(formValue: LubricantFormValue): string {
    const { lubricantType, grease } = formValue;

    return lubricantType === LubricantType.Arcanol
      ? grease.title
      : this.translate(
          `${TRANSLATIONS.lubricationOptions}.${lubricantType.toLowerCase()}`
        );
  }

  private getApplicationInputs(
    form: RecommendationFormValue
  ): LubricationInput[] {
    const { application } = form;
    const { temperature, battery } = application;

    const temperatureTitle = this.translate(TRANSLATIONS.temperatureTitle);
    const temperatureValue = this.translate(TRANSLATIONS.temperatureValue, {
      min: temperature.min,
      max: temperature.max,
    });
    const powerSupplyTitle = this.translate(TRANSLATIONS.powerSupplyTitle);
    const powerSupplyValue = this.translate(
      this.powerSupplyRadioOptions[battery].name
    );

    return [
      {
        title: temperatureTitle,
        value: temperatureValue,
      },
      {
        title: powerSupplyTitle,
        value: powerSupplyValue,
      },
    ];
  }

  private translate(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }
}
