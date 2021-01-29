import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getUsername } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../assets/i18n/en.json';
import { AppComponent } from './app.component';
import { unsetDisplay, unsetPredictionRequest } from './core/store';
import { initialState as initialInputState } from './core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from './core/store/reducers/prediction.reducer';
import { InputModule } from './feature/input/input.module';

const initialState = {
  input: initialInputState,
  prediction: initialPredictionState,
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let breakpointService: BreakpointService;
  let store: MockStore<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FlexLayoutModule,
        HeaderModule,
        HttpClientTestingModule,
        SettingsSidebarModule,
        RouterTestingModule,
        InputModule,
        provideTranslocoTestingModule({ en }),
        ReactiveComponentModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({ initialState })],
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    breakpointService = TestBed.inject(BreakpointService);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getUsername, 'Not John');
    fixture.detectChanges();
  });

  beforeEach(() => {});

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component['handleObservables'] = jest.fn();
    });

    it('should call handleObservables()', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['handleObservables']).toHaveBeenCalled();
    });
  });

  describe('#handleReset', () => {
    it('should dispatch two actions', () => {
      store.dispatch = jest.fn();

      component.handleReset();

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(unsetDisplay());
      expect(store.dispatch).toHaveBeenCalledWith(unsetPredictionRequest());
    });
  });

  describe('#userMenuClicked', () => {
    beforeEach(() => {
      component.logout = jest.fn();
    });

    it('should call method logout for key "logout"', () => {
      component.userMenuClicked('logout');

      expect(component.logout).toHaveBeenCalled();
    });

    it('should not call logout', () => {
      component.userMenuClicked(undefined);

      expect(component.logout).not.toHaveBeenCalled();
    });
  });

  describe('#logout', () => {
    it('should call method signOut of authGuard', () => {
      store.dispatch = jest.fn();
      component.logout();

      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    describe('#handleObservables', () => {
      beforeEach(() => {
        component.isLessThanMediumViewPort$ = undefined;

        spyOn(breakpointService, 'isLessThanMedium').and.callThrough();
      });

      it('should set isLessThanMediumViewPort$ properly', () => {
        expect(component.isLessThanMediumViewPort$).toBeUndefined();

        component['handleObservables']();

        expect(component.isLessThanMediumViewPort$).toBeDefined();
        expect(breakpointService.isLessThanMedium).toHaveBeenCalled();
      });
    });
  });
});
