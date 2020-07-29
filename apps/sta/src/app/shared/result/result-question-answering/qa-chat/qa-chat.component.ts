import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getUsername } from '@schaeffler/auth';

import {
  AppState,
  loadAnswerForFile,
  loadAnswerForText,
} from '../../../../core/store';
import { Answer } from '../../../../core/store/reducers/question-answering/models/answer.model';
import { QuestionAndAnswer } from '../../../../core/store/reducers/question-answering/models/question-and-answer.model';
import {
  HIGH_CONFIDENCE_ANSWERS,
  LOW_CONFIDENCE_ANSWERS,
  MEDIUM_CONFIDENCE_ANSWERS,
  REENGAGEMENT_MESSAGES,
} from './constants/bot-messages';

@Component({
  selector: 'sta-qa-chat',
  templateUrl: './qa-chat.component.html',
  styleUrls: ['./qa-chat.component.scss'],
})
export class QaChatComponent implements OnInit, OnDestroy {
  @Input() public questionsAndAnswers: QuestionAndAnswer[] = [];
  @Input() public selectedTabIndex: number;
  @Input() public answerIsLoading: boolean;

  public userGivenName$: Observable<string>;
  public userGivenName: string;

  public userInput: string;

  public readonly subscription: Subscription = new Subscription();

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
    this.subscription.add(
      this.userGivenName$.subscribe((username) => {
        this.userGivenName = username;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setObservables(): void {
    this.userGivenName$ = this.store.pipe(select(getUsername));
  }

  public sendQuestion(): void {
    if (this.selectedTabIndex === 0) {
      this.store.dispatch(loadAnswerForText({ question: this.userInput }));
    } else if (this.selectedTabIndex === 1) {
      this.store.dispatch(loadAnswerForFile({ question: this.userInput }));
    }

    this.userInput = '';
  }

  public trackByFn(index: number): number {
    return index;
  }

  public getConfidenceAnswer(answer: Answer): string {
    const confidenceAnswer =
      answer.logit > 1
        ? HIGH_CONFIDENCE_ANSWERS[answer.confidenceAnswerIndex]
        : answer.logit <= 1 && answer.logit > 0
        ? MEDIUM_CONFIDENCE_ANSWERS[answer.confidenceAnswerIndex]
        : LOW_CONFIDENCE_ANSWERS[answer.confidenceAnswerIndex];

    return confidenceAnswer.replace('[FIRSTNAME]', this.userGivenName);
  }

  public getReengagementMessage(index: number): string {
    return REENGAGEMENT_MESSAGES[index];
  }
}
