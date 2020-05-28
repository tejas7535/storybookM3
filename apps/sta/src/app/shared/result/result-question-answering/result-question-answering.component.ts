import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  AppState,
  getQuestionAnsweringDataForFile,
  getQuestionAnsweringDataForText,
  getSelectedTabIndexQuestionAnswering,
} from '../../../core/store';
import { QuestionAndAnswerDataForFile } from '../../../core/store/reducers/question-answering/models/question-answering-data-for-file.model';
import { QuestionAndAnswerDataForText } from '../../../core/store/reducers/question-answering/models/question-answering-data-for-text.model';

@Component({
  selector: 'sta-result-question-answering',
  templateUrl: './result-question-answering.component.html',
  styleUrls: ['./result-question-answering.component.scss'],
})
export class ResultQuestionAnsweringComponent implements OnInit {
  public selectedTabIndex$: Observable<number>;

  public questionAndAnsweringDataForText$: Observable<
    QuestionAndAnswerDataForText
  >;
  public questionAndAnsweringDataForFile$: Observable<
    QuestionAndAnswerDataForFile
  >;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  private setObservables(): void {
    this.selectedTabIndex$ = this.store.pipe(
      select(getSelectedTabIndexQuestionAnswering)
    );

    this.questionAndAnsweringDataForText$ = this.store.pipe(
      select(getQuestionAnsweringDataForText)
    );
    this.questionAndAnsweringDataForFile$ = this.store.pipe(
      select(getQuestionAnsweringDataForFile)
    );
  }
}
