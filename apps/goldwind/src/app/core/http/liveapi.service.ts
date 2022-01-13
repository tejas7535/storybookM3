import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  StaticSafetyFactorEntity,
  GcmProcessedEntity,
  LSPStrainEntity,
  RSMShaftEntity,
  LoadDistributionEntity,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class LiveAPIService {
  public apiUrl: string;

  constructor(private readonly http: HttpClient) {
    this.apiUrl = `${environment.baseUrl}`;
  }
  /**
   * Grabs the current shaft value
   * @param id the device id
   * @returns
   */
  public getRSMShaft(id: string): Observable<RSMShaftEntity> {
    return this.http.get<RSMShaftEntity>(
      `${this.apiUrl}/live/rsmshaft/${id}/data`
    );
  }

  /**
   * Grabs the LSP Strain Values
   * @param id device id
   */
  public getLspStrainProcessed(id: string): Observable<LSPStrainEntity> {
    return this.http.get<LSPStrainEntity>(
      `${this.apiUrl}/live/lspstrain/${id}/data`
    );
  }
  /**
   * Grabs the GcmProcessed Values
   * @param id device id
   */
  public getGcmProcessed(id: string): Observable<GcmProcessedEntity> {
    return this.http.get<GcmProcessedEntity>(
      `${this.apiUrl}/live/gcm/${id}/data`
    );
  }
  /**
   * Grabs the StaticSafetyFactor Values
   * @param id device id
   */
  public getStaticSafetyFactor(
    id: string
  ): Observable<StaticSafetyFactorEntity> {
    return this.http.get<StaticSafetyFactorEntity>(
      `${this.apiUrl}/live/analytics/${id}/static-safety-factor`
    );
  }

  /**
   * Grabs the getLoadDistribution Values
   * @param id device id
   */
  public getLoadDistribution(id: string): Observable<LoadDistributionEntity> {
    return this.http.get<LoadDistributionEntity>(
      `${this.apiUrl}/live/analytics/${id}/load-distribution`
    );
  }
}
