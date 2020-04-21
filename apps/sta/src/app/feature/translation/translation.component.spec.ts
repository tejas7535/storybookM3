import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { APP_STATE_MOCK } from '../../../testing/mocks/shared/app-state.mock';
import {
  AppState,
  loadTranslationForFile,
  loadTranslationForText,
  setSelectedTabIndexTranslation
} from '../../core/store';
import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { FunFactsLoadingBarModule } from '../../shared/fun-facts-loading-bar/fun-facts-loading-bar.module';
import {
  FileReplacement,
  Language,
  TextInput
} from '../../shared/result/models';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { TranslationComponent } from './translation.component';

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TranslationComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule,
        FunFactsLoadingBarModule,
        provideTranslocoTestingModule({})
      ],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
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
      expect(component.loadingTranslationForFile$).toBeDefined();
      expect(component.textInput$).toBeDefined();
      expect(component.loadingTranslationForText$).toBeDefined();
      expect(component.selectedTabIndex$).toBeDefined();
    });
  });

  describe('getTranslationForText', () => {
    test('should dispatch loadTranslationForText action', () => {
      store.dispatch = jest.fn();
      const textInput: TextInput = {
        text: 'text',
        targetLang: Language.DE,
        textLang: Language.EN
      };

      component.getTranslationForText(textInput);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadTranslationForText({ textInput })
      );
    });
  });

  describe('getTranslationForFile', () => {
    test('should call loadTranslationForFile', async () => {
      store.dispatch = jest.fn();
      const file = new File(['moin'], 'file', { type: 'abc' });
      await component.getTranslationForFile(file);

      const expected: FileReplacement = {
        name: file.name,
        type: file.type,
        content: [109, 111, 105, 110]
      };
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadTranslationForFile({ fileInput: { file: expected } })
      );
    });
  });

  describe('setSelectedTabIndex', () => {
    test('should dispatch setSelectedTabIndexTranslation action', () => {
      store.dispatch = jest.fn();
      const tabIndex = 0;

      component.setSelectedTabIndex(tabIndex);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedTabIndexTranslation({ selectedTabIndex: tabIndex })
      );
    });
  });
});
