import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthService } from '@schaeffler/shared/auth';
import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { AppComponent } from './app.component';

import { login, loginSuccess } from './core/store/actions/user/user.actions';

import * as fromUserSelector from './core/store/selectors/user/user.selectors';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HeaderModule,
        SettingsSidebarModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            hasValidAccessToken: jest.fn(),
            getUser: jest.fn(() => {}),
            configureImplicitFlow: jest.fn()
          }
        },
        provideMockStore()
      ],
      declarations: [AppComponent]
    });
  });

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: undefined,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      };
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(fromUserSelector.getUser, {
      username: 'John'
    });
    fixture.detectChanges();
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'Cost Database Analytics'`, () => {
    expect(component.title).toEqual('Cost Database Analytics');
  });

  describe('ngOnInit', () => {
    test('should define isLessThanMediumViewport$', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isLessThanMediumViewport$).toBeDefined();
    });
  });

  describe('handleReset', () => {
    test('should log to console', () => {
      spyOn(console, 'log');
      spyOn(console, 'warn');

      component.handleReset();

      expect(console.log).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('tryLogin', () => {
    test('should dispatch login if invalid access token', () => {
      component['authService'].hasValidAccessToken = jest.fn(() => false);
      store.dispatch = jest.fn();

      component['tryLogin']();

      expect(
        component['authService'].hasValidAccessToken
      ).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(login());
    });

    test('should do nothing when valid access token', () => {
      component['authService'].hasValidAccessToken = jest.fn(() => true);
      store.dispatch = jest.fn();

      component['tryLogin']();

      expect(component['authService'].hasValidAccessToken).toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('initImplicitFlow', () => {
    test('should dispatch login success when login successful', async(() => {
      component['authService'].configureImplicitFlow = jest.fn(() =>
        Promise.resolve(true)
      );
      store.dispatch = jest.fn();

      component['initImplicitFlow']();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(
          component['authService'].configureImplicitFlow
        ).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          loginSuccess({ user: undefined })
        );
      });
    }));

    test('should do nothing when login not succesful', async(() => {
      component['authService'].configureImplicitFlow = jest.fn(() =>
        Promise.resolve(false)
      );
      store.dispatch = jest.fn();

      component['initImplicitFlow']();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(
          component['authService'].configureImplicitFlow
        ).toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    }));
  });
});
