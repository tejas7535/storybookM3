import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DEMO_TEXT_EN } from '../../constants/demo-text-en.constant';
import {
  AppState,
  getFileStatusQuestionAnswering,
  getQuestionAnsweringDataForFile,
  getSelectedTabIndexQuestionAnswering,
  getTextInputQuestionAnswering,
  setLoadingForFileInput,
  setSelectedTabIndexQuestionAnswering,
  storeFileInput,
  storeTextInput,
} from '../../core/store';
import { Answer } from '../../core/store/reducers/question-answering/models/answer.model';
import { QuestionAndAnswerDataForFile } from '../../core/store/reducers/question-answering/models/question-answering-data-for-file.model';
import { QuestionAnsweringTextInput } from '../../core/store/reducers/question-answering/models/question-answering-text-input.model';
import { FileStatus } from '../../shared/file-upload/file-status.model';
import {
  FileReplacement,
  Language,
  TextInput,
} from '../../shared/result/models';

@Component({
  selector: 'sta-question-answering',
  templateUrl: './question-answering.component.html',
  styleUrls: ['./question-answering.component.scss'],
})
export class QuestionAnsweringComponent implements OnInit {
  public demoTextEn = DEMO_TEXT_EN;
  public maxWordCount = 40;

  public selectedTabIndex$: Observable<number>;
  public textInput$: Observable<QuestionAnsweringTextInput>;
  public fileStatus$: Observable<FileStatus>;
  public questionAndAnsweringDataForFile$: Observable<QuestionAndAnswerDataForFile>;
  public readonly subscription: Subscription = new Subscription();

  public fileTextInput: string;
  public fileAnswer: Answer;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
    this.subscription.add(
      this.questionAndAnsweringDataForFile$.subscribe(
        (fileStoreData: QuestionAndAnswerDataForFile) => {
          this.updateQuestionAnsweringData(fileStoreData);
        }
      )
    );
  }

  private setObservables(): void {
    this.selectedTabIndex$ = this.store.pipe(
      select(getSelectedTabIndexQuestionAnswering)
    );
    this.textInput$ = this.store.pipe(select(getTextInputQuestionAnswering));
    this.fileStatus$ = this.store.pipe(select(getFileStatusQuestionAnswering));
    this.questionAndAnsweringDataForFile$ = this.store.pipe(
      select(getQuestionAnsweringDataForFile)
    );
  }

  public updateQuestionAnsweringData(
    fileStoreData: QuestionAndAnswerDataForFile
  ): void {
    if (
      fileStoreData?.input &&
      fileStoreData.conversation?.length > 0 &&
      fileStoreData.input.textInput
    ) {
      this.fileTextInput = fileStoreData.input.textInput.replace(
        /[\n|\r]+/g,
        ' '
      );
      this.fileAnswer =
        fileStoreData.conversation[
          fileStoreData.conversation.length - 1
        ].answer;
    }
  }

  public setSelectedTabIndex(index: number): void {
    this.store.dispatch(
      setSelectedTabIndexQuestionAnswering({ selectedTabIndex: index })
    );
  }

  public async storeFile(file: File): Promise<void> {
    return new Promise<void>((resolve) => {
      this.store.dispatch(setLoadingForFileInput({ loading: true }));

      const reader = new FileReader();

      reader.onloadend = () => {
        const fileReplacement: FileReplacement = {
          name: file.name,
          type: file.type,
          content: Array.prototype.slice.call(
            new Int8Array(reader.result as ArrayBuffer)
          ),
        };
        this.store.dispatch(
          storeFileInput({
            file: fileReplacement,
          })
        );

        this.store.dispatch(setLoadingForFileInput({ loading: false }));
        resolve();
      };

      reader.readAsArrayBuffer(file);
    });
  }

  public storeTextInput(textInput: TextInput): void {
    this.store.dispatch(
      storeTextInput({
        text: textInput.text,
        textLang: textInput.textLang ? textInput.textLang : Language.EN,
      })
    );
  }

  public getFileAnswerTextBeforeAnswer(): string {
    const wordStart =
      this.fileAnswer.paragraphStart - this.maxWordCount < 0
        ? 0
        : this.fileAnswer.paragraphStart - this.maxWordCount;
    const wordsInText = this.fileTextInput.split(' ');

    let returnText = '';

    // tslint:disable-next-line: no-increment-decrement
    for (let i = wordStart; i < this.fileAnswer.paragraphStart; i++) {
      returnText += `${wordsInText[i]} `;
    }

    returnText = returnText.substr(0, returnText.length - 1);

    return returnText;
  }

  public getHighlightedAnswer(): string {
    const wordsInText = this.fileTextInput.split(' ');
    let returnText = '';
    for (
      let i = this.fileAnswer.paragraphStart;
      i <= this.fileAnswer.paragraphEnd;
      // tslint:disable-next-line: no-increment-decrement
      i++
    ) {
      returnText += `${wordsInText[i]} `;
    }

    returnText = returnText.substr(0, returnText.length - 1);

    return returnText;
  }

  public getFileAnswerTextAfterAnswer(): string {
    const wordsInText = this.fileTextInput.split(' ');
    const wordsEnd =
      this.fileAnswer.paragraphEnd + this.maxWordCount < wordsInText.length - 1
        ? this.fileAnswer.paragraphEnd + this.maxWordCount
        : wordsInText.length - 1;

    let returnText = '';
    // tslint:disable-next-line: no-increment-decrement
    for (let i = this.fileAnswer.paragraphEnd + 1; i <= wordsEnd; i++) {
      returnText += `${wordsInText[i]} `;
    }

    returnText = returnText.substr(0, returnText.length - 1);

    return returnText;
  }
}
