import { Injectable } from '@angular/core';
import { DataService } from '@schaeffler/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HardnessConversionResponseWithSide,
  HardnessUnitsResponse,
  InputSideTypes,
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
    unitIn: string,
    unitOut: string,
    val: number,
    side: InputSideTypes
  ): Observable<HardnessConversionResponseWithSide> {
    const body = {
      unit_in: unitIn,
      unit_out: unitOut,
      value: val,
    };

    return this.dataService
      .post<HardnessConversionResponseWithSide>(this.SCORE, body)
      .pipe(
        map((res) => {
          res.side = side;

          return res;
        })
      );
  }
}
