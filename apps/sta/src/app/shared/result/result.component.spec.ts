import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { APP_STATE_MOCK } from '../../../testing/mocks/shared/app-state.mock';
import * as fromTagging from '../../core/store';
import { GhostLineElementsModule } from '../ghost-elements/ghost-line-elements.module';
import { ResultAutoTaggingComponent } from './result-auto-tagging/result-auto-tagging.component';
import { ResultTranslationComponent } from './result-translation/result-translation.component';
import { ResultComponent } from './result.component';
import { DataStoreService } from './services/data-store.service';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let store: Store<fromTagging.AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatChipsModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        SnackBarModule,
        NoopAnimationsModule,
        GhostLineElementsModule
      ],
      declarations: [
        ResultComponent,
        ResultAutoTaggingComponent,
        ResultTranslationComponent
      ],
      providers: [
        DataStoreService,
        provideMockStore({ initialState: APP_STATE_MOCK })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set subscription', () => {
      component['setObservables'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.subscription).toBeDefined();
    });

    test('should call setObservables', () => {
      const mock = (component['setObservables'] = jest.fn());

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.translation$).toBeDefined();
      expect(component.tagsForText$).toBeDefined();
      expect(component.tagsForFile$).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    test('should call reset from dataStore service', () => {
      component['dataStore'].reset = jest.fn();

      component.reset();

      expect(component['dataStore'].reset).toHaveBeenCalledTimes(1);
    });

    test('should dispatch resetAll action', () => {
      store.dispatch = jest.fn();

      component.reset();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(fromTagging.resetAll());
    });
  });
});
