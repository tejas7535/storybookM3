import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import {
  Language,
  LanguageDetection,
  LanguageDetectionResponse,
  Tags,
  TextInput,
  Translation
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public async postTaggingText(text: string): Promise<string[]> {
    return this.http
      .post<Tags>(`${this.apiUrl}/tagging/text`, new TextInput(text))
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
    targetLang: Language,
    textLang: Language
  ): Promise<string> {
    return this.http
      .post<Translation>(
        `${this.apiUrl}/translation/text`,
        new TextInput(text, targetLang, textLang)
      )
      .pipe(map((response: Translation) => response.translation))
      .toPromise();
  }

  public async postTranslationFile(
    file: File,
    targetLang: Language,
    textLang: Language
  ): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('targetLang', targetLang);
    formData.append('textLang', textLang);

    return this.http
      .post<Translation>(`${this.apiUrl}/translation/file`, formData)
      .pipe(map((response: Translation) => response.translation))
      .toPromise();
  }

  public postLanguageDetectionText(
    text: string,
    userLang: Language
  ): Observable<LanguageDetectionResponse> {
    return this.http
      .post<LanguageDetectionResponse>(
        `${this.apiUrl}/language-detection/text`,
        new LanguageDetection(text, userLang)
      )
      .pipe(map((response: LanguageDetectionResponse) => response));
  }

  public postLanguageDetectionFile(
    file: File,
    userLang: Language
  ): Observable<LanguageDetectionResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userLang', userLang);

    return this.http
      .post<LanguageDetectionResponse>(
        `${this.apiUrl}/language-detection/file`,
        formData
      )
      .pipe(map((response: LanguageDetectionResponse) => response));
  }
}
