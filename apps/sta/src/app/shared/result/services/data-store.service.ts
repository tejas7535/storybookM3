import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { DataService } from './data.service';

import { Language } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  private readonly _tags: BehaviorSubject<string[]> = new BehaviorSubject(
    undefined
  );
  private readonly _translation: BehaviorSubject<string> = new BehaviorSubject(
    undefined
  );

  public readonly tags$ = this._tags.asObservable();
  public readonly translation$ = this._translation.asObservable();

  private readonly allData$ = combineLatest([this.tags$, this.translation$]);

  constructor(private readonly dataService: DataService) {}

  private set tags(val: string[]) {
    this._tags.next(val);
  }

  private set translation(val: string) {
    this._translation.next(val);
    console.log(this.translation);
  }

  public async getTagsForText(text: string): Promise<void> {
    this.tags = await this.dataService.postTaggingText(text);
  }

  public async getTagsForFile(file: File): Promise<void> {
    this.tags = await this.dataService.postTaggingFile(file);
  }

  public async getTranslationForText(
    text: string,
    targetLang: Language = Language.DE
  ): Promise<void> {
    this.translation = await this.dataService.postTranslationText(
      text,
      targetLang
    );
  }

  public async getTranslationForFile(
    file: File,
    targetLang: Language = Language.DE
  ): Promise<void> {
    this.translation = await this.dataService.postTranslationFile(
      file,
      targetLang
    );
  }

  /**
   * Check if data has already been stored in any subject.
   */
  public isDataAvailable(): Observable<boolean> {
    return this.allData$.pipe(
      map(([tags, translation]) => (tags || translation ? true : false))
    );
  }

  public reset(): void {
    this.tags = undefined;
    this.translation = undefined;
  }
}
