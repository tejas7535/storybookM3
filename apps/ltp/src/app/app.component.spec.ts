import { of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { BreakpointService } from '@schaeffler/shared/responsive';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { InputModule } from './feature/input/input.module';

import { AppComponent } from './app.component';

import { AuthService } from './core/services/auth.service';

import { initialState as initialInputState } from './core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from './core/store/reducers/prediction.reducer';

import * as en from '../assets/i18n/en.json';
import { unsetDisplay, unsetPredictionRequest } from './core/store';

const initialState = {
  input: initialInputState,
  prediction: initialPredictionState
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let authService: AuthService;
  let breakpointService: BreakpointService;
  let store: Store<any>;

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
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            getUserName: jest
              .fn()
              .mockImplementation(() => of('Moritz Muster')),
            logout: jest.fn()
          }
        },
        provideMockStore({ initialState })
      ]
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    breakpointService = TestBed.inject(BreakpointService);
    store = TestBed.inject(Store);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component['getCurrentProfile'] = jest.fn();
      component['handleObservables'] = jest.fn();
    });

    it('should call getCurrentProfile()', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['getCurrentProfile']).toHaveBeenCalled();
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
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
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

    describe('#getCurrentProfile', () => {
      beforeEach(() => {
        component.username$ = of('');
      });

      it('should set username Moritz Muster', () => {
        component['getCurrentProfile']();

        expect(JSON.stringify(component.username$)).toEqual(
          JSON.stringify(of('Moritz Muster'))
        );
      });
    });
  });
});
