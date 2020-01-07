import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { InputText, InputTranslation, Tags, Translation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public async postTaggingText(text: string): Promise<string[]> {
    return this.http
      .post<Tags>(`${this.apiUrl}/tagging/text`, new InputText(text))
      .pipe(map((tags: Tags) => tags.tags))
      .toPromise();
  }

  public async postTaggingFile(file: File): Promise<string[]> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post<Tags>(`${this.apiUrl}/tagging/file`, formData)
      .pipe(map((response: Tags) => response.tags))
      .toPromise();
  }

  public async postTranslationText(
    text: string,
    targetLang: string
  ): Promise<string> {
    return this.http
      .post<Translation>(
        `${this.apiUrl}/translation/text`,
        new InputTranslation(text, targetLang)
      )
      .pipe(map((response: Translation) => response.translation))
      .toPromise();
  }

  public async postTranslationFile(
    file: File,
    targetLang: string
  ): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('lang', targetLang);

    return this.http
      .post<Translation>(`${this.apiUrl}/translation/file`, formData)
      .pipe(map((response: Translation) => response.translation))
      .toPromise();
  }
}
