import { Injectable } from '@angular/core';
import { DataService } from '@schaeffler/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HardnessConversionResponse,
  HardnessUnitsResponse,
} from './hardness-converter-response.model';

@Injectable({
  providedIn: 'root',
})
export class HardnessConverterApiService {
  private readonly SCORE = 'hardness-conversion/api/score';

  public constructor(private readonly dataService: DataService) {}

  public getUnits(): Observable<string[]> {
    return this.dataService
      .post<HardnessUnitsResponse>(this.SCORE, { unitList: true })
      .pipe(map((response) => response.units));
  }

  public getConversionResult(
    unit: string,
    value: number
  ): Observable<HardnessConversionResponse> {
    const body = {
      value,
      unit_in: unit,
    };

    return this.dataService.post<HardnessConversionResponse>(this.SCORE, body);
  }
}
