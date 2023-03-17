import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IdValue } from '@gq/shared/models/search';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

export interface IdValueWithSearchTerm {
  result: IdValue;
  searchTerm: string;
}

interface GqSearchLastResultsState {
  version: number;
  results: IdValueWithSearchTerm[];
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchLastResultsService {
  private readonly VERSION = 1;
  private readonly LAST_RESULTS_KEY = 'GQ_SEARCH_LAST_RESULTS';
  private readonly MAX_NUMBER_OF_SAVED_RESULTS = 5;

  private readonly lastSearchResults$$ = new BehaviorSubject<IdValue[]>(
    this.getLastResults()
  );

  private readonly lastSearchTerms$$ = new BehaviorSubject<string[]>(
    this.getLastSearchTerms()
  );

  public lastSearchResults$ = this.lastSearchResults$$.asObservable();
  public lastSearchTerms$ = this.lastSearchTerms$$.asObservable();

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public addLastResult(idValue: IdValue, searchTerm: string) {
    let state = this.getLastResultsState()?.results ?? [];
    state.unshift({ result: idValue, searchTerm });
    state = state.slice(0, this.MAX_NUMBER_OF_SAVED_RESULTS);

    this.saveLastResultsState(state);
  }

  public getLastResults(): IdValue[] {
    const state = this.getLastResultsState();

    return (
      state?.results?.map((val: IdValueWithSearchTerm) => val.result) || []
    );
  }

  public getLastSearchTerms(): string[] {
    const state = this.getLastResultsState();

    return (
      state?.results?.map((val: IdValueWithSearchTerm) => val.searchTerm) || []
    );
  }

  public removeResult(result: IdValue) {
    const state = this.getLastResultsState();

    const updatedResults = state?.results?.filter(
      (res: IdValueWithSearchTerm) => res.result.id !== result.id
    );

    this.saveLastResultsState(updatedResults);
  }

  private getLastResultsState(): GqSearchLastResultsState {
    const state = this.localStorage.getItem(this.LAST_RESULTS_KEY);

    if (!state) {
      return undefined;
    }

    return JSON.parse(state) as GqSearchLastResultsState;
  }

  private saveLastResultsState(results: IdValueWithSearchTerm[]) {
    this.localStorage.setItem(
      this.LAST_RESULTS_KEY,
      JSON.stringify({
        version: this.VERSION,
        results,
      })
    );

    this.updateLastSearchResultSubjects();
  }

  private updateLastSearchResultSubjects() {
    this.lastSearchResults$$.next(this.getLastResults());
    this.lastSearchTerms$$.next(this.getLastSearchTerms());
  }
}
