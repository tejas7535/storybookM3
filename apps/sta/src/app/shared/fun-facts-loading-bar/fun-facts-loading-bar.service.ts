import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { FunFact } from './models/fun-fact.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FunFactsLoadingBarService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly translocoService: TranslocoService
  ) {}

  public getFunFact(): Observable<string> {
    return this.http
      .get<FunFact>(
        `${
          this.apiUrl
        }/fun-facts?language=${this.translocoService.getActiveLang()}`
      )
      .pipe(map((response: FunFact) => response.funFact));
  }
}
