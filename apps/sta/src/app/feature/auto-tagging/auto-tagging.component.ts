import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { DEMO_TEXT_EN } from '../../constants/demo-text-en.constant';

import { FileStatus } from '../../shared/file-upload/file-status.model';
import { TextInput } from '../../shared/result/models/text-input.model';

import {
  AppState,
  getFileStatus,
  getSelectedTabIndexTagging,
  getTextInput,
  loadTagsForFile,
  loadTagsForText,
  setSelectedTabIndex
} from '../../core/store';
import { FileReplacement } from '../../shared/result/models';

@Component({
  selector: 'sta-auto-tagging',
  templateUrl: './auto-tagging.component.html',
  styleUrls: ['./auto-tagging.component.scss']
})
export class AutoTaggingComponent implements OnInit {
  public demoTextEn = DEMO_TEXT_EN;
  public disabledLanguages = ['de'];
  public showTargetLanguage = false;

  public fileStatus$: Observable<FileStatus>;
  public textInput$: Observable<string>;
  public selectedTabIndex$: Observable<number>;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  private setObservables(): void {
    this.fileStatus$ = this.store.pipe(select(getFileStatus));
    this.textInput$ = this.store.pipe(select(getTextInput));
    this.selectedTabIndex$ = this.store.pipe(
      select(getSelectedTabIndexTagging)
    );
  }

  public getTagsForText(textInput: TextInput): void {
    this.store.dispatch(loadTagsForText({ text: textInput.text }));
  }

  public async getTagsForFile(file: File): Promise<void> {
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
        this.store.dispatch(loadTagsForFile({ file: fileReplacement }));

        resolve();
      };
    });
  }

  public setSelectedTabIndex(index: number): void {
    this.store.dispatch(setSelectedTabIndex({ selectedTabIndex: index }));
  }
}
