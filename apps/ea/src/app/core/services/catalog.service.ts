import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, switchMap, throwError } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { toNumberString } from '@ea/shared/helper';

import {
  BasicFrequenciesResult,
  CalculationParametersOperationConditions,
  CatalogCalculationResult,
  LoadCaseData,
  ProductCapabilitiesResult,
} from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import {
  CatalogServiceBasicFrequenciesResult,
  CatalogServiceBearingSearchResult,
  CatalogServiceCalculationResult,
  CatalogServiceLoadCaseData,
  CatalogServiceOperatingConditions,
  CatalogServiceOperatingConditionsISOClass,
  CatalogServiceTemplateResult,
} from './catalog.service.interface';
import {
  convertCatalogCalculationResult,
  convertTemplateResult,
} from './catalog-helper';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly baseUrl = `${environment.catalogApiBaseUrl}/v1/CatalogBearing`;

  constructor(private readonly httpClient: HttpClient) {}

  public getBearingSearch(query: string): Observable<string[]> {
    const singlePageResultSizeToIncludeAllBearing = '15000';

    return this.httpClient
      .get<CatalogServiceBearingSearchResult>(
        `${this.baseUrl}/product/search`,
        {
          params: {
            pattern: query,
            size: singlePageResultSizeToIncludeAllBearing,
          },
        }
      )
      .pipe(
        map((searchResult: CatalogServiceBearingSearchResult) => {
          const bearingDesignations = searchResult.data.map(
            (item) => item.data.title
          );

          return bearingDesignations;
        })
      );
  }

  public getBearingCapabilities(
    designation: string
  ): Observable<ProductCapabilitiesResult> {
    return this.httpClient.get<ProductCapabilitiesResult>(
      `${this.baseUrl}/product/capabilities`,
      { params: { designation } }
    );
  }

  public getBasicFrequencies(
    bearingId: string
  ): Observable<BasicFrequenciesResult> {
    if (!bearingId) {
      return throwError(() => new Error('bearingId must be provided'));
    }

    return this.httpClient
      .get<CatalogServiceBasicFrequenciesResult>(
        `${this.baseUrl}/product/basicfrequencies/${bearingId}`
      )
      .pipe(
        map((results) => {
          const result = results.data.results[0];
          const basicFrequencies: BasicFrequenciesResult = {
            title: result.title,
            rows: result.fields.map((field) => ({
              ...field,
              value: Number.parseFloat(field.values?.[0].content),
              unit: field.values?.[0].unit,
            })),
          };

          return basicFrequencies;
        })
      );
  }

  public getBasicFrequenciesPdf(bearingId: string): Observable<Blob> {
    return this.httpClient.get(
      `${this.baseUrl}/product/basicfrequencies/pdf/${bearingId}`,
      {
        responseType: 'blob',
      }
    );
  }

  public downloadBasicFrequenciesPdf(bearingId: string): Observable<void> {
    return this.getBasicFrequenciesPdf(bearingId).pipe(
      map((data) => {
        // create download element and click on it
        const downloadLink = document.createElement('a');
        downloadLink.target = '_blank';
        downloadLink.href = URL.createObjectURL(
          new Blob([data], { type: data.type })
        );

        downloadLink.click();
      })
    );
  }

  public getCalculationResult(
    bearingId: string,
    operationConditions: CalculationParametersOperationConditions
  ): Observable<CatalogCalculationResult> {
    if (!bearingId) {
      return throwError(() => new Error('bearingId must be provided'));
    }

    const {
      lubrication: lubricationConditions,
      ambientTemperature,
      contamination,
      conditionOfRotation,
      loadCaseData,
    } = operationConditions;

    const lubricationMethod = this.convertLubricationMethod(
      lubricationConditions
    );

    const definitionOfViscosity = this.convertDefinitionOfViscosity(
      lubricationConditions
    );
    const grease =
      definitionOfViscosity === 'LB_ARCANOL_GREASE'
        ? lubricationConditions.grease.typeOfGrease.typeOfGrease
        : 'LB_PLEASE_SELECT';
    const isoVgClass =
      definitionOfViscosity === 'LB_ISO_VG_CLASS'
        ? this.convertIsoVgClass(lubricationConditions)
        : 'LB_PLEASE_SELECT';

    const viscosity =
      lubricationConditions[lubricationConditions.lubricationSelection]
        .viscosity;
    const ny40 =
      definitionOfViscosity === 'LB_ENTER_VISCOSITIES'
        ? toNumberString(viscosity?.ny40 || 0)
        : '0';
    const ny100 =
      definitionOfViscosity === 'LB_ENTER_VISCOSITIES'
        ? toNumberString(viscosity?.ny100 || 0)
        : '0';

    const environmentalInfluence =
      definitionOfViscosity === 'LB_ARCANOL_GREASE'
        ? lubricationConditions.grease.environmentalInfluence
        : 'LB_AVERAGE_AMBIENT_INFLUENCE';

    const operatingConditions: CatalogServiceOperatingConditions = {
      IDL_LUBRICATION_METHOD: lubricationMethod,
      IDL_INFLUENCE_OF_AMBIENT: environmentalInfluence,
      IDL_CLEANESS_VALUE: contamination,
      IDSLC_TEMPERATURE: toNumberString(ambientTemperature),
      IDL_DEFINITION_OF_VISCOSITY: definitionOfViscosity,
      IDL_ISO_VG_CLASS: isoVgClass,
      IDL_GREASE: grease,
      IDL_NY_40: ny40,
      IDL_NY_100: ny100,
      IDL_CONDITION_OF_ROTATION:
        conditionOfRotation === 'innerring'
          ? 'LB_ROTATING_INNERRING'
          : 'LB_ROTATING_OUTERRING',

      IDL_OIL_FLOW: toNumberString(
        lubricationConditions.recirculatingOil.oilFlow || 0
      ),
      IDL_OIL_TEMPERATURE_DIFFERENCE: toNumberString(
        lubricationConditions.recirculatingOil.oilTemperatureDifference || 0
      ),
      IDL_EXTERNAL_HEAT_FLOW: toNumberString(
        lubricationConditions.recirculatingOil.externalHeatFlow || 0
      ),
    };

    const loadcaseData: CatalogServiceLoadCaseData[] =
      this.getLoadCasesData(loadCaseData);

    let calculationError: string;

    return this.httpClient
      .post<CatalogServiceCalculationResult>(
        `${this.baseUrl}/product/calculate/${bearingId}`,
        {
          operatingConditions,
          loadcaseData,
        }
      )
      .pipe(
        map((result) => {
          if (result.data?.errors?.length > 0) {
            calculationError =
              result.data.message?.replace('\n', ' ')?.trim() ||
              'Unable to calculate';
          }

          return result;
        }),
        switchMap((result) => this.getCalculationResultReport(result)),
        map((result) => {
          const res = convertCatalogCalculationResult(
            result,
            calculationError,
            loadcaseData.length > 1
          );

          return res;
        })
      );
  }

  public getCalculationResultReport(
    result: CatalogServiceCalculationResult
  ): Observable<BearinxOnlineResult> {
    const jsonReportUrl = result?._links?.find(
      (link) => link.rel === 'json'
    )?.href;

    if (!jsonReportUrl) {
      throw new Error('Unable to find report url');
    }

    const formattedUrl = new URL(jsonReportUrl);

    const re = new RegExp(
      '(^127.)|(^10.)|(^172.1[6-9].)|(^172.2\\d.)|(^172.3[0-1].)|(^192.168.)'
    );
    if (re.test(formattedUrl.hostname)) {
      // the url returned is within a private ip range due to a bug in the backend
      // so we will naively replace it with the hostname we initially requested for the catalog url
      // this is a naive approach and is only intended as a **temporary** fix while the backend is working
      // on their proper implementation
      //
      // TODO: remove once the backend bug is gone

      const catalogUrl = new URL(environment.catalogApiBaseUrl);
      formattedUrl.port = catalogUrl.port;
      formattedUrl.protocol = catalogUrl.protocol;
      formattedUrl.hostname = catalogUrl.hostname;
      formattedUrl.host = catalogUrl.host;
      formattedUrl.pathname = `/catalogue${formattedUrl.pathname}`;
    }

    return this.httpClient.get<BearinxOnlineResult>(formattedUrl.toString());
  }

  public getLoadcaseTemplate(bearingId: string) {
    return this.httpClient
      .get<CatalogServiceTemplateResult>(
        `${this.baseUrl}/product/loadcasetemplate/${bearingId}`
      )
      .pipe(map((result) => convertTemplateResult(result)));
  }

  public getOperatingConditionsTemplate(bearingId: string) {
    return this.httpClient
      .get<CatalogServiceTemplateResult>(
        `${this.baseUrl}/product/operatingconditonstemplate/${bearingId}`
      )
      .pipe(map((result) => convertTemplateResult(result)));
  }

  private getLoadCasesData(
    loadCaseData: LoadCaseData[]
  ): CatalogServiceLoadCaseData[] {
    return loadCaseData.map((loadCase) => ({
      IDCO_DESIGNATION: loadCaseData.length === 1 ? '' : loadCase.loadCaseName,
      IDSLC_TIME_PORTION:
        loadCaseData.length === 1
          ? '100'
          : toNumberString(loadCase.operatingTime || 0),
      IDSLC_AXIAL_LOAD: toNumberString(loadCase.load?.axialLoad || 0),
      IDSLC_RADIAL_LOAD: toNumberString(loadCase.load?.radialLoad || 0),
      IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE: toNumberString(
        loadCase.operatingTemperature
      ),
      IDSLC_TYPE_OF_MOVEMENT: loadCase.rotation.typeOfMotion,
      IDLC_SPEED: toNumberString(loadCase.rotation.rotationalSpeed || 0),
      IDSLC_MOVEMENT_FREQUENCY: toNumberString(
        loadCase.rotation.shiftFrequency || 0
      ),
      IDSLC_OPERATING_ANGLE: toNumberString(loadCase.rotation.shiftAngle || 0),
    }));
  }

  private convertLubricationMethod(
    lubricationConditions: CalculationParametersOperationConditions['lubrication']
  ): CatalogServiceOperatingConditions['IDL_LUBRICATION_METHOD'] {
    const { lubricationSelection } = lubricationConditions;
    switch (lubricationSelection) {
      case 'grease':
        return 'LB_GREASE_LUBRICATION';
      case 'oilBath':
        return 'LB_OIL_BATH_LUBRICATION';
      case 'oilMist':
        return 'LB_OIL_MIST_LUBRICATION';
      case 'recirculatingOil':
        return 'LB_RECIRCULATING_OIL_LUBRICATION';
      default:
        throw new Error(
          `Unsupported lubrication method: ${lubricationSelection}`
        );
    }
  }

  private convertDefinitionOfViscosity(
    lubricationConditions: CalculationParametersOperationConditions['lubrication']
  ): CatalogServiceOperatingConditions['IDL_DEFINITION_OF_VISCOSITY'] {
    const { selection } =
      lubricationConditions[lubricationConditions.lubricationSelection];

    switch (selection) {
      case 'isoVgClass':
        return 'LB_ISO_VG_CLASS';
      case 'typeOfGrease':
        return 'LB_ARCANOL_GREASE';
      case 'viscosity':
        return 'LB_ENTER_VISCOSITIES';
      default:
        throw new Error(`Unsupported definition of viscosity: ${selection}`);
    }
  }

  private convertIsoVgClass(
    lubricationConditions: CalculationParametersOperationConditions['lubrication']
  ): CatalogServiceOperatingConditionsISOClass['IDL_ISO_VG_CLASS'] {
    return `LB_ISO_VG_${
      lubricationConditions[lubricationConditions.lubricationSelection]
        .isoVgClass.isoVgClass
    }`;
  }
}
