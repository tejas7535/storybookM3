import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InputText } from './models/input-text.model';

import { environment } from '../../../environments/environment';
import { Tags } from './models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = environment.apiBaseUrl;

  private readonly tags$: BehaviorSubject<string[]> = new BehaviorSubject(
    undefined
  );

  constructor(private readonly http: HttpClient) {}

  /*
   * Getters
   */

  public get tags(): Observable<string[]> {
    return this.tags$.asObservable();
  }

  /*
   * Trigger Rest Calls
   */

  public postTaggingText(text: string): void {
    this.http
      .post<Tags>(`${this.apiUrl}/tagging`, new InputText(text))
      .pipe(map((tags: Tags) => tags.tags))
      .subscribe(tags => {
        this.tags$.next(tags);
      });
  }

  /*
   * Utils
   */

  /**
   * Check if data has already been stored in all subjects.
   */
  public isDataAvailable(): Observable<boolean> {
    return combineLatest([this.tags]).pipe(
      map(([tags]) => tags && tags.length > 0)
    );
  }

  /*
   * Check if all observables still have their initial state
   */
  public isInitialEmptyState(): Observable<boolean> {
    return combineLatest([this.tags]).pipe(map(([tags]) => !tags));
  }
}
