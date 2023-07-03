import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, retry, timer } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
  FrictionCalculationResult,
} from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertFrictionApiResult } from './friction-helper';
import {
  FrictionServiceBearingData,
  FrictionServiceLoadCaseData,
} from './friction-service.interface';

@Injectable({ providedIn: 'root' })
export class FrictionService {
  readonly baseUrl = `${environment.frictionApiBaseUrl}/v1.3/co2calculator`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Creates a new calculation model in the backend
   * @param bearingDesignation name of the bearing
   * @returns modelId
   */
  createFrictionModel(bearingDesignation: string): Observable<string> {
    return this.http
      .put<string>(
        `${this.baseUrl}/create`,
        {},
        { params: { designation: bearingDesignation } }
      )
      .pipe(
        map((response) => {
          if (!response) {
            throw new Error('No model id returned');
          }

          return response;
        })
      );
  }

  /**
   * Updates given model with new parameters in the backend
   * @param modelId
   * @param bearingData
   * @param loadcaseData
   * @returns void
   */
  updateFrictionModel(
    modelId: string,
    operationConditions: CalculationParametersOperationConditions,
    energySource: CalculationParametersEnergySource
  ): Observable<void> {
    const viscosity =
      operationConditions?.lubrication?.[
        operationConditions?.lubrication?.lubricationSelection
      ]?.isoVgClass?.isoVgClass;
    const bearingData: FrictionServiceBearingData = {
      idscO_CO2_EMISSION_FACTOR_CALCULATION: energySource.type,
      idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN:
        energySource.type === 'LB_FOSSIL_ENERGY'
          ? energySource.fossilOrigin
          : undefined,
      idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL:
        energySource.type === 'LB_ELECTRIC_ENERGY'
          ? energySource.electricityRegion
          : undefined,
      idL_OILTEMP: operationConditions.oilTemp,
      idL_VG: viscosity,
    };

    const loadcaseData: FrictionServiceLoadCaseData[] = [
      {
        idslC_OPERATING_TIME_IN_HOURS: operationConditions.operatingTime,
        idlC_TYPE_OF_MOVEMENT: operationConditions.rotation?.typeOfMovement,
        idlC_OSCILLATION_ANGLE: operationConditions.oscillationAngle,
        idlC_MOVEMENT_FREQUENCY: operationConditions.movementFrequency,
        idlC_SPEED: operationConditions.rotation?.rotationalSpeed,
        idlD_FX: operationConditions.load?.axialLoad ?? undefined,
        idlD_FY: operationConditions.load?.radialLoad ?? undefined,
        idlD_FZ: 0,
      },
    ];

    return this.http.put<void>(`${this.baseUrl}/${modelId}/update`, {
      bearingData,
      loadcaseData,
    });
  }

  /**
   * Triggers a calculation for the given modelId in the backend
   * @param modelId
   * @returns calculationId
   */
  calculateFrictionModel(modelId: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/${modelId}/calculate`);
  }

  getCalculationResult(
    modelId: string,
    calculationId: string
  ): Observable<FrictionCalculationResult> {
    return this.http
      .get<BearinxOnlineResult>(
        `${this.baseUrl}/${modelId}/output/${calculationId}`,
        { observe: 'response', responseType: 'json' }
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            // convert
            return convertFrictionApiResult(response.body);
          }
          // throw to retry
          throw new Error('Calculation result still pending');
        }),
        retry({
          count: 3600,
          delay: (error: HttpErrorResponse | Error) => {
            if (error instanceof HttpErrorResponse) {
              // no need to retry true HTTP errors
              throw error;
            }

            // otherwise delay for 1 second
            return timer(1000);
          },
        })
      );
  }
}
