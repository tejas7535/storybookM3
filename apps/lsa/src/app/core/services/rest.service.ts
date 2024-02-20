import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ReplaySubject, take } from 'rxjs';

import { environment } from '@lsa/environments/environment';
import {
  Grease,
  RecommendationRequest,
  RecommendationResponse,
} from '@lsa/shared/models';

@Injectable({ providedIn: 'root' })
export class RestService {
  public greases$ = new ReplaySubject<Grease[]>(1);
  public recommendation$ = new ReplaySubject<RecommendationResponse>(1);

  private readonly BASE_URL = environment.lsaApiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public getGreases(): void {
    this.http
      .get<Grease[]>(`${this.BASE_URL}/greases`)
      .pipe(take(1))
      .subscribe((greases) => this.greases$.next(greases));
  }

  public getLubricatorRecommendation(request: RecommendationRequest): void {
    this.http
      .post<RecommendationResponse>(`${this.BASE_URL}/recommendation`, request)
      .pipe(take(1))
      .subscribe((recommendation) => this.recommendation$.next(recommendation));
  }
}
