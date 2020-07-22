import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { APP_STATE_MOCK } from '../../../../testing/mocks/shared/app-state.mock';
import { QaChatModule } from './qa-chat/qa-chat.module';
import { ResultQuestionAnsweringComponent } from './result-question-answering.component';

describe('ResultQuestionAnsweringComponent', () => {
  let component: ResultQuestionAnsweringComponent;
  let fixture: ComponentFixture<ResultQuestionAnsweringComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ResultQuestionAnsweringComponent],
      imports: [
        MatExpansionModule,
        FlexLayoutModule,
        QaChatModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultQuestionAnsweringComponent);
    component = fixture.componentInstance;
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
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.selectedTabIndex$).toBeDefined();
      expect(component.questionAndAnsweringDataForText$).toBeDefined();
      expect(component.questionAndAnsweringDataForFile$).toBeDefined();
    });
  });
});
