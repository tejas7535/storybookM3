import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadAnswerForFile,
  loadAnswerForFileFailure,
  loadAnswerForFileSuccess,
  loadAnswerForText,
  loadAnswerForTextFailure,
  loadAnswerForTextSuccess,
  resetAll,
  resetQuestionAnswering,
} from '../../actions';
import { Answer } from '../../reducers/question-answering/models/answer.model';
import { QuestionAnsweringFileInput } from '../../reducers/question-answering/models/question-answering-file-input.model';
import { QuestionAnsweringTextInput } from '../../reducers/question-answering/models/question-answering-text-input.model';
import { QuestionAnsweringState } from '../../reducers/question-answering/question-answering.reducer';
import {
  getFileInputQuestionAnswering,
  getTextInputQuestionAnswering,
} from '../../selectors';

/**
 * Effect class for all question answering related actions which trigger side effects
 */
@Injectable()
export class QuestionAnsweringEffects {
  /**
   * Effect to send text and question to API and receive answer
   */
  loadAnswerText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAnswerForText.type),
      withLatestFrom(this.store.pipe(select(getTextInputQuestionAnswering))),
      map(([action, textInput]: [any, QuestionAnsweringTextInput]) => {
        const textInputPostBody: QuestionAnsweringTextInput = {
          question: action.question,
          text: textInput.text,
          textLang: textInput.textLang,
        };

        return textInputPostBody;
      }),
      concatMap((textInput: QuestionAnsweringTextInput) =>
        this.dataService.postQuestionAnsweringText(textInput).pipe(
          map((answer: Answer) => {
            answer.confidenceAnswerIndex = this.getRandomInt(4);
            answer.reengagementMessageIndex = this.getRandomInt(4);

            return loadAnswerForTextSuccess({ answer });
          }),
          catchError((_e) => of(loadAnswerForTextFailure()))
        )
      )
    )
  );

  /**
   * Effect to send file and question to API and receive answer
   */
  loadAnswerFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAnswerForFile.type),
      withLatestFrom(this.store.pipe(select(getFileInputQuestionAnswering))),
      map(([action, fileInput]: [any, QuestionAnsweringFileInput]) => {
        const fileInputPostBody: QuestionAnsweringFileInput = {
          question: action.question,
          file: fileInput.file,
          textLang: fileInput.textLang,
        };

        return fileInputPostBody;
      }),
      concatMap((fileInput: QuestionAnsweringFileInput) =>
        this.dataService.postQuestionAnsweringFile(fileInput).pipe(
          map((answer: Answer) => {
            answer.confidenceAnswerIndex = this.getRandomInt(4);
            answer.reengagementMessageIndex = this.getRandomInt(4);
            const textInput = answer.textInput;
            delete answer.textInput;

            return loadAnswerForFileSuccess({ answer, textInput });
          }),
          catchError((_e) => of(loadAnswerForFileFailure()))
        )
      )
    )
  );

  /**
   * Effect to reset question answering
   */
  resetQuestionAnswering$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetAll.type),
        tap(() => {
          this.store.dispatch(resetQuestionAnswering());
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    protected readonly store: Store<QuestionAnsweringState>
  ) {}

  public getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
