import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Answer } from '../../../core/store/reducers/question-answering/models/answer.model';
import { QuestionAnsweringFileInput } from '../../../core/store/reducers/question-answering/models/question-answering-file-input.model';
import { QuestionAnsweringTextInput } from '../../../core/store/reducers/question-answering/models/question-answering-text-input.model';
import { TranslationFileInput } from '../../../core/store/reducers/translation/models/translation-file-input.model';
import {
  FileReplacement,
  Language,
  LanguageDetection,
  LanguageDetectionResponse,
  Tags,
  TextInput,
  Translation,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public postTaggingText(text: string): Observable<string[]> {
    return this.http
      .post<Tags>(`${this.apiUrl}/tagging/text`, new TextInput(text))
      .pipe(map((tags: Tags) => tags.tags));
  }

  public postTaggingFile(
    fileReplacement: FileReplacement
  ): Observable<string[]> {
    const formData: FormData = new FormData();
    const file = new File(
      [Int8Array.from(fileReplacement.content)],
      fileReplacement.name,
      {
        type: fileReplacement.type,
      }
    );
    formData.append('file', file, file.name);

    return this.http
      .post<Tags>(`${this.apiUrl}/tagging/file`, formData)
      .pipe(map((response: Tags) => response.tags));
  }

  public postTranslationText(textInput: TextInput): Observable<Translation> {
    const postTextInput: TextInput = {
      text: textInput.text,
      textLang: textInput.textLang ? textInput.textLang : Language.EN,
      targetLang: textInput.targetLang ? textInput.targetLang : Language.DE,
    };

    return this.http
      .post<Translation>(`${this.apiUrl}/translation/text`, postTextInput)
      .pipe(map((response: Translation) => response));
  }

  public postTranslationFile(
    fileInput: TranslationFileInput
  ): Observable<Translation> {
    const formData: FormData = new FormData();
    const file = new File(
      [Int8Array.from(fileInput.file.content)],
      fileInput.file.name,
      { type: fileInput.file.type }
    );
    formData.append('file', file, file.name);
    formData.append(
      'targetLang',
      fileInput.targetLang ? fileInput.targetLang : Language.DE
    );
    formData.append(
      'textLang',
      fileInput.textLang ? fileInput.textLang : Language.EN
    );

    return this.http
      .post<Translation>(`${this.apiUrl}/translation/file`, formData)
      .pipe(map((response: Translation) => response));
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

  public postQuestionAnsweringText(
    textInput: QuestionAnsweringTextInput
  ): Observable<Answer> {
    return this.http
      .post<Answer>(`${this.apiUrl}/question-answering/text`, textInput)
      .pipe(map((response: Answer) => response));
  }

  public postQuestionAnsweringFile(
    fileInput: QuestionAnsweringFileInput
  ): Observable<Answer> {
    const formData: FormData = new FormData();

    const file = new File(
      [Int8Array.from(fileInput.file.content)],
      fileInput.file.name,
      { type: fileInput.file.type }
    );
    formData.append('file', file, file.name);

    formData.append('question', fileInput.question);

    return this.http
      .post<Answer>(`${this.apiUrl}/question-answering/file`, formData)
      .pipe(map((response: Answer) => response));
  }
}
