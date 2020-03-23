import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { GhostLineElementsModule } from '../../ghost-elements/ghost-line-elements.module';

import { ResultAutoTaggingComponent } from './result-auto-tagging.component';

import { APP_STATE_MOCK } from '../../../../testing/mocks/shared/app-state.mock';
import {
  addTagForFile,
  addTagForText,
  AppState,
  removeTagForFile,
  removeTagForText,
  setShowMoreTagsFile,
  setShowMoreTagsText
} from '../../../core/store';

describe('ResultAutoTaggingComponent', () => {
  let component: ResultAutoTaggingComponent;
  let fixture: ComponentFixture<ResultAutoTaggingComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        SnackBarModule,
        NoopAnimationsModule,
        GhostLineElementsModule,
        HttpClientTestingModule
      ],
      declarations: [ResultAutoTaggingComponent],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultAutoTaggingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    component.tags = {
      tags: ['1', '2'],
      loading: false,
      showMoreTags: false,
      success: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOniInit', () => {
    test('should set subscription', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.subscription).toBeDefined();
    });
  });

  describe('add', () => {
    test('should dispatch addTagsForText when value when value is part of event and selectedTabIndex === 0', () => {
      component.selectedTabIndex = 0;
      store.dispatch = jest.fn();
      const testValue = 'test ';
      const expectedValue = 'test';
      component.add(({ value: testValue } as unknown) as MatChipInputEvent);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        addTagForText({ tag: expectedValue })
      );
    });

    test('should dispatch addTagsForFile when value when value is part of event and selectedTabIndex === 1', () => {
      component.selectedTabIndex = 1;
      store.dispatch = jest.fn();
      const testValue = 'test ';
      const expectedValue = 'test';
      component.add(({ value: testValue } as unknown) as MatChipInputEvent);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        addTagForFile({ tag: expectedValue })
      );
    });

    test('should not dispatch anything on selectedTabIndex != 1 or 0', () => {
      component.selectedTabIndex = 2;
      store.dispatch = jest.fn();
      const testValue = 'test ';
      component.add(({ value: testValue } as unknown) as MatChipInputEvent);

      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });

    test('should reset input when input is part of event', () => {
      const evt = ({
        input: { value: 'top' }
      } as unknown) as MatChipInputEvent;
      component.add(evt);

      expect(evt.input.value).toEqual('');
    });
  });

  describe('remove()', () => {
    test('should dispatch removeTagForText action when selectedTabIndex === 0', () => {
      component.selectedTabIndex = 0;
      store.dispatch = jest.fn();
      const tag = 'apple';

      component.remove(tag);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(removeTagForText({ tag }));
    });

    test('should dispatch removeTagForFile action when selectedTabIndex === 1', () => {
      component.selectedTabIndex = 1;
      store.dispatch = jest.fn();
      const tag = 'apple';

      component.remove(tag);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(removeTagForFile({ tag }));
    });

    test('should not dispatch anything when selectedTabIndex != 1 or 0', () => {
      component.selectedTabIndex = 2;
      store.dispatch = jest.fn();
      const tag = 'apple';

      component.remove(tag);

      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('copyToClipBoard', () => {
    test('it should copy text to clip board and show success message', () => {
      component.tags.tags = ['test'];
      component['document'].execCommand = jest.fn();
      component['snackBarService'].showSuccessMessage = jest.fn();
      component.copyToClipBoard();

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(document.execCommand).toHaveBeenCalledTimes(1);
      expect(
        component['snackBarService'].showSuccessMessage
      ).toHaveBeenCalledTimes(1);
      expect(
        component['snackBarService'].showSuccessMessage
      ).toHaveBeenCalledWith('Copied to clipboard');
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });

  describe('showMoreTags', () => {
    test('should dispatch setShowMoreTagsText action when selectedTabIndex === 0', () => {
      component.selectedTabIndex = 0;
      store.dispatch = jest.fn();

      component.showMoreTags();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setShowMoreTagsText({ showMoreTags: true })
      );
    });

    test('should dispatch setShowMoreTagsFile action when selectedTabIndex === 1', () => {
      component.selectedTabIndex = 1;
      store.dispatch = jest.fn();

      component.showMoreTags();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setShowMoreTagsFile({ showMoreTags: true })
      );
    });

    test('should not dispatch anything when selectedTabIndex != 1 or 0', () => {
      component.selectedTabIndex = 2;
      store.dispatch = jest.fn();

      component.showMoreTags();

      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
