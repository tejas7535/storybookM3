import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { API, ComparisonPath } from '@cdba/shared/constants/api';
import { BomIdentifier } from '@cdba/shared/models';

import { Comparison } from '../../../shared/models/comparison.model';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  constructor(private readonly httpClient: HttpClient) {}

  getComparison(identifiers: BomIdentifier[]): Observable<Comparison> {
    const path = `${API.v1}/${ComparisonPath}`;

    return this.httpClient.post<Comparison>(path, identifiers);
  }
}
