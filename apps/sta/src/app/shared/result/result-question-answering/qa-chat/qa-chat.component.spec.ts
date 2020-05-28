import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/shared/app-state.mock';
import { AuthService } from '../../../../core/auth.service';
import {
  AppState,
  loadAnswerForFile,
  loadAnswerForText,
} from '../../../../core/store';
import { Answer } from '../../../../core/store/reducers/question-answering/models/answer.model';
import {
  HIGH_CONFIDENCE_ANSWERS,
  LOW_CONFIDENCE_ANSWERS,
  MEDIUM_CONFIDENCE_ANSWERS,
  REENGAGEMENT_MESSAGES,
} from './constants/bot-messages';
import { QaChatComponent } from './qa-chat.component';

describe('QaChatComponent', () => {
  let component: QaChatComponent;
  let fixture: ComponentFixture<QaChatComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [QaChatComponent],
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        FormsModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserGivenName: jest
              .fn()
              .mockImplementation(() => of('Username')),
            initConfig: jest.fn(),
          },
        },
        provideMockStore({ initialState: APP_STATE_MOCK }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QaChatComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call setObservables and set subscription', () => {
      const mock = (component['setObservables'] = jest.fn());

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(mock).toHaveBeenCalledTimes(1);
      expect(component.subscription).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.userGivenName$).toBeDefined();
    });
  });

  describe('sendQuestion', () => {
    test('should dispatch loadAnswerForText when selectedTabIndex === 0', () => {
      store.dispatch = jest.fn();
      component.selectedTabIndex = 0;

      const mockUserInput = 'abc';
      component.userInput = mockUserInput;

      const action = loadAnswerForText({ question: mockUserInput });

      component.sendQuestion();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    test('should dispatch loadAnswerForFile when selectedTabIndex === 1', () => {
      store.dispatch = jest.fn();
      component.selectedTabIndex = 1;

      const mockUserInput = 'abc';
      component.userInput = mockUserInput;

      const action = loadAnswerForFile({ question: mockUserInput });

      component.sendQuestion();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    test('should reset userInput', () => {
      component.userInput = 'abc';
      component.sendQuestion();

      expect(component.userInput).toEqual('');
    });
  });

  describe('trackByFun', () => {
    test('should return input', () => {
      expect(component.trackByFn(1)).toEqual(1);
    });
  });

  describe('getConfidenceAnswer', () => {
    test('should return high confidence answer message', () => {
      const mockAnswer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 2,
        paragraphEnd: 1,
        paragraphStart: 0,
        confidenceAnswerIndex: 0,
      };

      expect(component.getConfidenceAnswer(mockAnswer)).toEqual(
        HIGH_CONFIDENCE_ANSWERS[mockAnswer.confidenceAnswerIndex]
      );
    });

    test('should return medium confidence answer message', () => {
      const mockAnswer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 0.5,
        paragraphEnd: 1,
        paragraphStart: 0,
        confidenceAnswerIndex: 0,
      };

      expect(component.getConfidenceAnswer(mockAnswer)).toEqual(
        MEDIUM_CONFIDENCE_ANSWERS[mockAnswer.confidenceAnswerIndex]
      );
    });

    test('should return low confidence answer message', () => {
      const mockAnswer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 0,
        paragraphEnd: 1,
        paragraphStart: 0,
        confidenceAnswerIndex: 0,
      };

      expect(component.getConfidenceAnswer(mockAnswer)).toEqual(
        LOW_CONFIDENCE_ANSWERS[mockAnswer.confidenceAnswerIndex]
      );
    });

    test('should replace [FIRSTNAME] in answer constant with the user given name', () => {
      const mockAnswer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 0,
        paragraphEnd: 1,
        paragraphStart: 0,
        confidenceAnswerIndex: 3,
      };

      const userName = 'Peter';
      component.userGivenName = userName;

      const expectText = LOW_CONFIDENCE_ANSWERS[
        mockAnswer.confidenceAnswerIndex
      ].replace('[FIRSTNAME]', userName);

      expect(component.getConfidenceAnswer(mockAnswer)).toEqual(expectText);
    });
  });

  describe('getReengagementMessage', () => {
    test('should return reengangement messagr at given index', () => {
      const index = 0;
      expect(component.getReengagementMessage(index)).toEqual(
        REENGAGEMENT_MESSAGES[index]
      );
    });
  });
});
