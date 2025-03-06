/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { DownstreamCalculationService } from '@ea/core/services/downstream-calculation.service';
import {
  DownstreamAPIRequest,
  DownstreamOperatingConditions,
  LubricationMethodType,
} from '@ea/core/services/downstream-calculation.service.interface';
import { DownstreamCalculationInputsService } from '@ea/core/services/downstream-calculation-inputs.service';
import {
  CONDITION_OF_ROTATION_VALUES,
  ENERGY_SOURCES_VALUES,
  LUBRICATION_METHOD_VALUE_MAPPING,
} from '@ea/core/services/downstream-calcululation.service.constant';
import { parseErrorObject } from '@ea/shared/helper/downstream-error-helper';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CO2DownstreamCalculationActions } from '../../actions';
import {
  CalculationParametersFacade,
  ProductSelectionFacade,
} from '../../facades';
import { CalculationParametersOperationConditions } from '../../models';

@Injectable()
export class DownstreamCalculationEffects {
  public fetchDownstreamCalculation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CO2DownstreamCalculationActions.fetchDownstreamCalculation),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.calculationParametersFacade.getLoadcases$,
        this.calculationParametersFacade.operationConditions$,
      ]),
      switchMap(([_action, designation, loadcases, operatingConditions]) => {
        const lubrication = operatingConditions.lubrication;
        const greaseType = this.getGreaseType(lubrication);
        const lubricationMethod = this.getLubricationMethod(lubrication);

        const viscosityDefinition =
          this.convertDefinitionOfViscosity(lubrication);
        const isoVgClass = this.getIsoVgClass(viscosityDefinition, lubrication);

        const { energySource } = operatingConditions;
        const emissionFactorCalculation = this.getEmissionFactor(energySource);
        const isRecirculatingOil =
          this.isLubricationOfrecirculatingOil(lubricationMethod);
        const recirculatingOil = lubrication.recirculatingOil;
        const externalHeatFlow = recirculatingOil.externalHeatFlow;
        const oilTempRise = recirculatingOil.oilTemperatureDifference;

        const rotationType = CONDITION_OF_ROTATION_VALUES.get(
          operatingConditions.conditionOfRotation
        );

        const calcRequest: DownstreamAPIRequest = {
          operatingConditions: {
            electricEmissionFactor: energySource.electric?.electricityRegion,
            fossilEmissionFactor: energySource.fossil?.fossilOrigin,
            emissionFactor: emissionFactorCalculation,
            operatingTimeInHours: operatingConditions.time,
            temperature: operatingConditions.ambientTemperature,
            ny40: lubrication.oilBath.viscosity.ny40,
            ny100: lubrication.oilBath.viscosity.ny100,
            oilFlow: isRecirculatingOil ? recirculatingOil.oilFlow : undefined,
            oilTemperatureRise: isRecirculatingOil ? oilTempRise : undefined,
            externalHeatFlow: isRecirculatingOil ? externalHeatFlow : undefined,
            lubricationMethod,
            isoVgClassCalculated: undefined, // only valid for'LB_CALCULATE_VISCOSITIES' types which are not supported
            greaseType,
            viscosityDefinition,
            isoVgClass,
            rotationType,
          },
          loadcases: loadcases.flatMap((lc) => {
            const conditions = operatingConditions.loadCaseData[lc.index];
            const { rotation, operatingTime, operatingTemperature, load } =
              conditions;

            return {
              designation: lc.loadCaseName || '',
              speed: rotation.rotationalSpeed || 0,
              timePortion:
                operatingTime && loadcases.length > 1 ? operatingTime : 100,
              axialLoad: load.axialLoad || 0,
              radialLoad: load.radialLoad || 0,
              movementType: rotation.typeOfMotion,
              operatingTemperature,
            };
          }),
        };

        return this.downstreamService
          .getDownstreamCalculation(designation, calcRequest)
          .pipe(
            takeUntil(
              this.actions$.pipe(
                ofType(
                  CO2DownstreamCalculationActions.fetchDownstreamCalculation
                )
              )
            ),
            switchMap((result) => {
              return of(
                CO2DownstreamCalculationActions.setDownstreamCalculationResult({
                  result,
                  inputs: this.inputsService.formatDownstreamInputs(result),
                })
              );
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                CO2DownstreamCalculationActions.setCalculationFailure({
                  errors: parseErrorObject(error.error?.errors),
                })
              );
            })
          );
      })
    )
  );

  constructor(
    private readonly downstreamService: DownstreamCalculationService,
    private readonly actions$: Actions,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly inputsService: DownstreamCalculationInputsService
  ) {}

  private getEmissionFactor(
    energySource: CalculationParametersOperationConditions['energySource']
  ): DownstreamOperatingConditions['emissionFactor'] {
    return ENERGY_SOURCES_VALUES.get(energySource.type);
  }

  private isLubricationOfrecirculatingOil(
    lubricationMethod: LubricationMethodType
  ): boolean {
    const recirculatingOilType: LubricationMethodType =
      'LB_RECIRCULATING_OIL_LUBRICATION';

    return lubricationMethod === recirculatingOilType;
  }

  private getGreaseType(
    lubrication: CalculationParametersOperationConditions['lubrication']
  ): DownstreamOperatingConditions['greaseType'] | undefined {
    const GREASE_SELECTION = 'grease';
    const TYPE_OF_GREASE_SELECTION = 'typeOfGrease';

    if (lubrication.lubricationSelection !== GREASE_SELECTION) {
      return undefined;
    }

    if (lubrication.grease.selection !== TYPE_OF_GREASE_SELECTION) {
      return undefined;
    }

    const greaseType = lubrication.grease.typeOfGrease
      .typeOfGrease as DownstreamOperatingConditions['greaseType'];

    return greaseType;
  }

  private getLubricationMethod(
    lubrication: CalculationParametersOperationConditions['lubrication']
  ): LubricationMethodType {
    return LUBRICATION_METHOD_VALUE_MAPPING.get(
      lubrication.lubricationSelection
    );
  }

  private getIsoVgClass(
    viscosityDefintion: DownstreamOperatingConditions['viscosityDefinition'],
    lubricationConditions: CalculationParametersOperationConditions['lubrication']
  ): DownstreamOperatingConditions['isoVgClass'] {
    if (
      viscosityDefintion !== 'LB_ISO_VG_CLASS' ||
      !lubricationConditions.lubricationSelection
    ) {
      return undefined;
    }

    return `LB_ISO_VG_${
      lubricationConditions[lubricationConditions.lubricationSelection]
        .isoVgClass.isoVgClass
    }`;
  }

  private convertDefinitionOfViscosity(
    lubricationConditions: CalculationParametersOperationConditions['lubrication']
  ): DownstreamOperatingConditions['viscosityDefinition'] {
    const selection = lubricationConditions.lubricationSelection
      ? lubricationConditions[lubricationConditions.lubricationSelection]
          .selection
      : undefined;
    //  'LB_CALCULATE_VISCOSITIES' type is not currently supported.
    switch (selection) {
      case 'isoVgClass':
        return 'LB_ISO_VG_CLASS';
      case 'typeOfGrease':
        return 'LB_ARCANOL_GREASE';
      case 'viscosity':
        return 'LB_ENTER_VISCOSITIES';
      default:
        return undefined;
    }
  }
}
