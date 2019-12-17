import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  BreakpointService,
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { KeycloakAngularModule } from 'keycloak-angular';
import { configureTestSuite } from 'ng-bullet';

import { InputModule } from './feature/input/input.module';
import { getTranslocoModule } from './shared/transloco/transloco-testing.module';

import { AppComponent } from './app.component';

import { initialState as initialInputState } from './core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from './core/store/reducers/prediction.reducer';

import { AuthGuard } from './core/guards/auth.guard';
import { unsetDisplay, unsetPredictionRequest } from './core/store';

const initialState = {
  input: initialInputState,
  prediction: initialPredictionState
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let authGuard: AuthGuard;
  let breakpointService: BreakpointService;
  let translationService: transloco.TranslocoService;
  let store: Store<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FlexLayoutModule,
        HeaderModule,
        SettingsSidebarModule,
        RouterTestingModule,
        InputModule,
        getTranslocoModule(),
        KeycloakAngularModule
      ],
      providers: [
        AuthGuard,
        provideMockStore({ initialState }),
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
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
    authGuard = TestBed.get(AuthGuard);
    breakpointService = TestBed.get(BreakpointService);
    translationService = TestBed.get(transloco.TranslocoService);
    store = TestBed.get(Store);
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
      authGuard.signOut = jest.fn();

      component.logout();

      expect(authGuard.signOut).toHaveBeenCalled();
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
        component.username = '';
      });

      it('should set username Moritz Muster', async () => {
        const mockUser = { firstName: 'Moritz', lastName: 'Muster' };
        authGuard.getCurrentProfile = jest.fn().mockResolvedValue(mockUser);

        await component['getCurrentProfile']();

        expect(component.username).toEqual('Moritz Muster');
      });
    });
  });
});
