import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalculationParametersEnergySource } from '@ea/core/store/models';
import { TranslocoService } from '@ngneat/transloco';

export const getElectricityRegionOptions = (
  translocoService: TranslocoService
): Observable<
  {
    label: string;
    value: CalculationParametersEnergySource['electric']['electricityRegion'];
  }[]
> =>
  combineLatest([
    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.argentina'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_ARGENTINA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.australia'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_AUSTRALIA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.brazil'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_BRAZIL' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.canada'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_CANADA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.china'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_CHINA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.europeanUnion'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_EUROPEAN_UNION' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.france'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_FRANCE' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.germany'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_GERMANY' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.greatBritain'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_GREAT_BRITAIN' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.india'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_INDIA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.indonesia'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_INDONESIA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.italy'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_ITALY' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.japan'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_JAPAN' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.mexico'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_MEXICO' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.russianFederation'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_RUSSIAN_FEDERATION' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.southAfrica'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_SOUTH_AFRICA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.southKorea'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_SOUTH_KOREA' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.electricityRegionOption.turkey'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_TURKEYZLB_USA' as const,
        }))
      ),
  ]);

export const getFossilOriginOptions = (
  translocoService: TranslocoService
): Observable<
  {
    label: string;
    value: CalculationParametersEnergySource['fossil']['fossilOrigin'];
  }[]
> =>
  combineLatest([
    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.gasoline'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_GASOLINE_FOSSIL' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.diesel'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_DIESEL_FOSSIL' as const,
        }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.e10'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_GASOLINE_E10' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.diesel87'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_DIESEL_B7' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.lpg'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_LPG' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.cng'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_CNG' as const,
        }))
      ),

    translocoService
      .selectTranslate(
        'operationConditions.energySource.fossilOriginOptions.cngBiomethane'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_CNG_BIOMETHANE' as const,
        }))
      ),
  ]);
