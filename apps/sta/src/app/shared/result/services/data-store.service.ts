import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { DataService } from './data.service';

import { FileStatus } from '../../file-upload/file-status.model';

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
  private readonly _reset: Subject<void> = new Subject();

  private readonly _loadingTags: Subject<boolean> = new BehaviorSubject(
    undefined
  );

  private readonly _loadingTranslation: Subject<boolean> = new BehaviorSubject(
    undefined
  );

  public readonly tags$ = this._tags.asObservable();
  public readonly translation$ = this._translation.asObservable();
  public readonly reset$ = this._reset.asObservable();
  public readonly loadingTags$ = this._loadingTags.asObservable();
  public readonly loadingTranslation$ = this._loadingTranslation.asObservable();

  constructor(private readonly dataService: DataService) {}

  private set tags(val: string[]) {
    this._tags.next(val);
  }

  private set translation(val: string) {
    this._translation.next(val);
  }

  public async getTranslationForText(
    text: string,
    targetLang: Language = Language.DE,
    textLang: Language = Language.EN
  ): Promise<void> {
    this._loadingTranslation.next(true);
    try {
      this.translation = await this.dataService.postTranslationText(
        text,
        targetLang,
        textLang
      );
    } catch (_e) {}
    this._loadingTranslation.next(false);
  }

  public async getTranslationForFile(
    file: File,
    targetLang: Language = Language.DE,
    textLang: Language = Language.EN
  ): Promise<FileStatus> {
    this._loadingTranslation.next(true);
    let successfulCall = true;

    this.reset();

    try {
      this.translation = await this.dataService.postTranslationFile(
        file,
        targetLang,
        textLang
      );
    } catch (_e) {
      successfulCall = false;
    }

    this._loadingTranslation.next(false);

    return new FileStatus(file.name, file.type, successfulCall);
  }

  public reset(): void {
    this.tags = undefined;
    this.translation = undefined;

    this._reset.next();
  }
}
