import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { HeaderModule } from '@schaeffler/header';
import { startLoginFlow } from '@schaeffler/shared/auth';

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
        MatButtonModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore()],
      declarations: [AppComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
    });
  });
});
