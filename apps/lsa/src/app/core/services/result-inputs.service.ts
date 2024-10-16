import { Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { LubricantType, PowerSupply } from '@lsa/shared/constants';
import {
  LubricantFormValue,
  RecommendationFormValue,
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
  lubricationOptions: 'recommendation.lubrication.options',
  lubricationPointsOptime: 'recommendation.lubricationPoints.optime',
  relubricationQuantityTitle: 'inputs.relubricationQuantity.title',
  relubricationQuantityValue: 'inputs.relubricationQuantity.value',
  powerExternalOption: 'recommendation.application.powerOptions.external',
  powerBatteryOption: 'recommendation.application.powerOptions.battery',
  powerNoPreferenceOption:
    'recommendation.application.powerOptions.noPreference',
};

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

  public getResultInputs(form: RecommendationFormValue): ResultInputModel {
    return {
      sections: [
        {
          title: this.translate(TRANSLATIONS.lubricationPointsTitle),
          stepIndex: 0,
          inputs: this.getLubricationPointsInputs(form),
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
    form: RecommendationFormValue
  ): LubricationInput[] {
    const {
      lubricationPoints,
      lubricationQty,
      lubricationInterval,
      pipeLength,
      optime,
    } = form.lubricationPoints;

    const lubricationPointsTitle = this.translate(
      TRANSLATIONS.lubricationPointsTitle
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
    const optimeTitle = this.translate(TRANSLATIONS.optimeTitle);
    const optimeValue = this.translate(
      `${TRANSLATIONS.lubricationPointsOptime}.${optime}`
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
        value: pipeLength.title,
      },
      {
        title: optimeTitle,
        value: optimeValue,
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
