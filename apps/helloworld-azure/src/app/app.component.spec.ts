import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { HeaderModule } from '@schaeffler/header';
import { FooterModule } from '@schaeffler/shared/ui-components';

import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HeaderModule,
        FooterModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            getUserName: jest.fn(),
          },
        },
      ],
      declarations: [AppComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
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
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['authService'].getUserName).toHaveBeenCalled();
    });
  });
});
