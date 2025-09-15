import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Bearing } from '@mm/core/store/models/calculation-selection-state.model';
import { BearingOption, BearingSearchItem } from '@mm/shared/models';
import { CalculationRequestPayload } from '@mm/shared/models/calculation-request.model';
import { BearingInfoResponse } from '@mm/shared/models/can-calculate-response.model';
import { ListValue } from '@mm/shared/models/list-value.model';
import { ThermalCalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { withCache } from '@ngneat/cashew';

import { environment } from '../../../../environments/environment';
import {
  BearingSeatsResponse,
  MMBearingPreflightResponse,
  PreflightRequestBody,
  SearchResult,
  ShaftMaterialResponse,
  SimpleListResponse,
} from '../../../shared/models';
import { BearinxOnlineResult } from '../bearinx-result.interface';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly httpClient = inject(HttpClient);
  private readonly translocoService = inject(TranslocoService);

  private readonly bearingCalculationPath = `${environment.baseUrl}/calculate`;

  public getBearingSearch(searchQuery: string): Observable<SearchResult> {
    return this.httpClient.get<SearchResult>(
      `${environment.baseUrl}/bearings/search?pattern=${searchQuery}&page=1&size=1000`
    );
  }

  public searchBearings(searchQuery: string): Observable<BearingOption[]> {
    return this.getBearingSearch(searchQuery).pipe(
      map((response) =>
        response.data
          .map((item: BearingSearchItem) => ({
            id: item.name,
            title: item.name,
            isThermal: item.isThermal,
            isMechanical: item.isMechanical,
            isHydraulic: item.isHydraulic,
          }))
          .filter(
            (bearing) =>
              bearing.isThermal || bearing.isMechanical || bearing.isHydraulic
          )
      )
    );
  }

  public getBearingCalculationResult(
    requestPayload: CalculationRequestPayload
  ): Observable<BearinxOnlineResult> {
    return this.httpClient.post<BearinxOnlineResult>(
      this.bearingCalculationPath,
      requestPayload,
      {
        context: withCache({ version: JSON.stringify(requestPayload) }),
      }
    );
  }

  public getBearingPreflightResponse(
    body: PreflightRequestBody
  ): Observable<MMBearingPreflightResponse> {
    const path = `${environment.baseUrl}/dialog`;

    return this.httpClient.post<MMBearingPreflightResponse>(path, body);
  }

  public getBearingsMaterialResponse(
    idmmShaftMaterial: string
  ): Observable<ShaftMaterialResponse> {
    return this.httpClient.get<ShaftMaterialResponse>(
      `${environment.baseUrl}/materials/${idmmShaftMaterial}`,
      { context: withCache({ version: this.translocoService.getActiveLang() }) }
    );
  }

  public fetchBearingInfo(bearingId: string): Observable<Bearing> {
    const url = `${environment.baseUrl}/cancalculate?designation=${encodeURIComponent(bearingId)}`;

    return this.getLoadOptions<BearingInfoResponse>(url).pipe(
      map((bearingData: BearingInfoResponse) => {
        const bearing = {
          bearingId,
          title: bearingData.name ?? '',
          isThermal: bearingData.isThermal ?? false,
          isMechanical: bearingData.isMechanical ?? false,
          isHydraulic: bearingData.isHydraulic ?? false,
        };

        // Throw error if bearing has no valid type flags
        if (
          !bearing.isThermal &&
          !bearing.isMechanical &&
          !bearing.isHydraulic
        ) {
          throw new Error(
            `Invalid bearing configuration: Bearing "${bearingId}" has no valid type flags set`
          );
        }

        return bearing;
      })
    );
  }

  public getLoadOptions<T>(requestUrl: string): Observable<T> {
    return this.httpClient.get<T>(requestUrl, {
      context: withCache({ version: this.translocoService.getActiveLang() }),
    });
  }

  public getBearinxVersions(): Observable<{ [key: string]: string }> {
    return this.httpClient
      .get<
        { name: string; version: string }[]
      >(`${environment.bearinxApiBaseUrl}/version`)
      .pipe(
        map((response) =>
          Object.fromEntries(
            response.map(({ name, version }) => [name, version])
          )
        )
      );
  }

  public getToleranceClasses(designation: string): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${environment.baseUrl}/bearings/toleranceclasses?designation=${designation}`,
      {
        context: withCache({ version: this.translocoService.getActiveLang() }),
      }
    );
  }

  public getThermalBearingCalculationResult(
    requestPayload: {
      designation: string;
    } & ThermalCalculationOptionsFormData
  ): Observable<BearinxOnlineResult> {
    return this.httpClient.post<BearinxOnlineResult>(
      `${environment.baseUrl}/calculate/thermal`,
      requestPayload,
      {
        context: withCache({ version: JSON.stringify(requestPayload) }),
      }
    );
  }

  public getBearingSeats(bearingId: string): Observable<ListValue[]> {
    const url = `${environment.baseUrl}/bearings/${encodeURIComponent(bearingId)}`;

    return this.getLoadOptions<BearingSeatsResponse>(url).pipe(
      map((response) => this.mapToListValues(response.bearingSeats))
    );
  }

  public getMeasurementMethods(bearingId: string): Observable<ListValue[]> {
    const url = `${environment.baseUrl}/bearings/${encodeURIComponent(bearingId)}/measuringmethods`;

    return this.getLoadOptions<SimpleListResponse>(url).pipe(
      map((response) => this.mapToListValues(response))
    );
  }

  public getThermalBearingMountingMethods(
    bearingId: string
  ): Observable<ListValue[]> {
    const url = `${environment.baseUrl}/bearings/${encodeURIComponent(bearingId)}/mountingmethods`;

    return this.getLoadOptions<SimpleListResponse>(url).pipe(
      map((response) => this.mapToListValues(response))
    );
  }

  public getNonThermalBearingMountingMethods(
    bearingId: string,
    bearingSeatId: string,
    measurementMethodId: string
  ): Observable<ListValue[]> {
    const encodedBearingId = encodeURIComponent(bearingId);
    const url = `${environment.baseUrl}/bearings/${encodedBearingId}/seats/${bearingSeatId}/measuringmethods/${measurementMethodId}/mountingmethods`;

    return this.getLoadOptions<SimpleListResponse>(url).pipe(
      map((response) => this.mapToListValues(response))
    );
  }

  private mapToListValues(
    items: { id: string; title: string; image: string | undefined }[]
  ): ListValue[] {
    return items.map((item) => ({
      id: item.id,
      text: item.title,
      imageUrl: item.image ? this.getImageUrl(item.image) : undefined,
    }));
  }

  private getImageUrl(imageName: string): string {
    const baseImageURL = environment.baseUrl.replace('/v3/mountingmanager', '');

    return `${baseImageURL}/images/${imageName}`;
  }
}
