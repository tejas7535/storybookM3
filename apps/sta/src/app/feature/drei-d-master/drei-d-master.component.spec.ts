import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { APP_STATE_MOCK } from '../../../testing/mocks/shared/app-state.mock';
import { AppState, loadClassificationForText } from '../../core/store';
import { TextInput } from '../../shared/result/models';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { DreiDMasterComponent } from './drei-d-master.component';

describe('DreiDMasterComponent', () => {
  let component: DreiDMasterComponent;
  let fixture: ComponentFixture<DreiDMasterComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TextInputModule,
        MatTabsModule,
        NoopAnimationsModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [DreiDMasterComponent],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DreiDMasterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
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
    test('should set observables', () => {
      component['setObservables']();

      expect(component.textInput$).toBeDefined();
    });
  });

  describe('getClassificationForText', () => {
    test('should dispatch loadClassificationForText Action', () => {
      store.dispatch = jest.fn();

      const textInput: TextInput = { text: 'text' };

      component.getClassificationForText(textInput);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadClassificationForText({ textInput })
      );
    });
  });
});
