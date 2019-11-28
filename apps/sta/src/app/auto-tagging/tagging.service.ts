import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InputText } from './models/input-text.model';

import { environment } from '../../environments/environment';
import { Tags } from './models/';

@Injectable({
  providedIn: 'root'
})
export class TaggingService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get tags for a specific text
   */
  public getTags(text: InputText): Observable<String[]> {
    return this.http
      .post<Tags>(`${this.apiUrl}/tagging`, text)
      .pipe(map((tags: Tags) => tags.tags));
  }
}
