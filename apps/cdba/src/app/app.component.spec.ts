import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { getUser, loginImplicitFlow } from '@schaeffler/shared/auth';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HeaderModule,
        FooterModule,
        MatButtonModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore()],
      declarations: [AppComponent],
    });
  });

  beforeEach(() => {
    // window.matchMedia = jest.fn().mockImplementation((query) => {
    //   return {
    //     matches: false,
    //     media: query,
    //     onchange: undefined,
    //     addListener: jest.fn(), // deprecated
    //     removeListener: jest.fn(), // deprecated
    //     addEventListener: jest.fn(),
    //     removeEventListener: jest.fn(),
    //     dispatchEvent: jest.fn(),
    //   };
    // });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(getUser, {
      username: 'John',
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
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isLessThanMediumViewport$).toBeDefined();
      expect(component.username$).toBeDefined();
      expect(store.dispatch).toHaveBeenCalledWith(loginImplicitFlow());
    });
  });
});
