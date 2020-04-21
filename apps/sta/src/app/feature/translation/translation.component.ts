import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DEMO_TEXT_EN } from '../../constants/demo-text-en.constant';
import {
  AppState,
  loadTranslationForFile,
  loadTranslationForText,
  setSelectedTabIndexTranslation
} from '../../core/store';
import { TranslationTextInput } from '../../core/store/reducers/translation/models/translation-text-input.model';
import {
  getFileStatusTranslation,
  getLoadingTranslationForFile,
  getLoadingTranslationForText,
  getSelectedTabIndexTranslation,
  getTextInputTranslation
} from '../../core/store/selectors/translation/translation.selector';
import { FileStatus } from '../../shared/file-upload/file-status.model';
import { FileReplacement, TextInput } from '../../shared/result/models';

@Component({
  selector: 'sta-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {
  public demoTextEn = DEMO_TEXT_EN;

  public fileStatus$: Observable<FileStatus>;
  public loadingTranslationForFile$: Observable<boolean>;
  public textInput$: Observable<TranslationTextInput>;
  public loadingTranslationForText$: Observable<boolean>;
  public selectedTabIndex$: Observable<number>;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  private setObservables(): void {
    this.fileStatus$ = this.store.pipe(select(getFileStatusTranslation));
    this.loadingTranslationForFile$ = this.store.pipe(
      select(getLoadingTranslationForFile)
    );
    this.textInput$ = this.store.pipe(select(getTextInputTranslation));
    this.loadingTranslationForText$ = this.store.pipe(
      select(getLoadingTranslationForText)
    );
    this.selectedTabIndex$ = this.store.pipe(
      select(getSelectedTabIndexTranslation)
    );
  }

  public getTranslationForText(textInput: TextInput): void {
    const input: TextInput = {
      text: textInput.text,
      targetLang: textInput.targetLang,
      textLang: textInput.textLang
    };
    this.store.dispatch(loadTranslationForText({ textInput: input }));
  }

  public async getTranslationForFile(file: File): Promise<void> {
    return new Promise<void>(resolve => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        const fileReplacement: FileReplacement = {
          name: file.name,
          type: file.type,
          content: Array.prototype.slice.call(
            new Int8Array(reader.result as ArrayBuffer)
          )
        };
        this.store.dispatch(
          loadTranslationForFile({
            fileInput: { file: fileReplacement }
          })
        );

        resolve();
      };
    });
  }

  public setSelectedTabIndex(index: number): void {
    this.store.dispatch(
      setSelectedTabIndexTranslation({ selectedTabIndex: index })
    );
  }
}
