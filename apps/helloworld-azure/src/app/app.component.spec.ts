import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getUsername, startLoginFlow } from '@schaeffler/auth';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HeaderModule,
        FooterModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      declarations: [AppComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(getUsername, 'John');
    fixture.detectChanges();
  });

  test('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test(`should have as title 'helloworld-azure'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.platformTitle).toEqual('Hello World Azure');
  });

  describe('ngOnInit', () => {
    test('should call getUserName', () => {
      store.dispatch = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
    });
  });
});
