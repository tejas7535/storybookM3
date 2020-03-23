import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';

import { AutoTaggingComponent } from './auto-tagging.component';

import { APP_STATE_MOCK } from '../../../testing/mocks/shared/app-state.mock';
import {
  AppState,
  loadTagsForFile,
  loadTagsForText,
  setSelectedTabIndex
} from '../../core/store';
import { FileReplacement, TextInput } from '../../shared/result/models';

describe('AutoTaggingComponent', () => {
  let component: AutoTaggingComponent;
  let fixture: ComponentFixture<AutoTaggingComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule,
        provideTranslocoTestingModule({})
      ],
      declarations: [AutoTaggingComponent],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTaggingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call setObservables', () => {
      component['setObservables'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['setObservables']).toHaveBeenCalledTimes(1);
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.fileStatus$).toBeDefined();
      expect(component.textInput$).toBeDefined();
      expect(component.selectedTabIndex$).toBeDefined();
    });
  });

  describe('getTagsForText', () => {
    test('should dispatch loadTagsForText action', () => {
      store.dispatch = jest.fn();
      const textInput: TextInput = { text: 'text' };

      component.getTagsForText(textInput);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadTagsForText({ text: textInput.text })
      );
    });
  });

  describe('getTagsForFile', () => {
    test('should call getTagsFromFile', async () => {
      store.dispatch = jest.fn();
      const file = new File(['moin'], 'file', { type: 'abc' });
      await component.getTagsForFile(file);

      const expected: FileReplacement = {
        name: file.name,
        type: file.type,
        content: [109, 111, 105, 110]
      };
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadTagsForFile({ file: expected })
      );
    });
  });

  describe('setSelectedTabIndex', () => {
    test('should dispatch setSelectedTabIndex action', () => {
      store.dispatch = jest.fn();
      const tabIndex = 0;

      component.setSelectedTabIndex(tabIndex);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedTabIndex({ selectedTabIndex: tabIndex })
      );
    });
  });
});
