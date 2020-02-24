import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

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
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ],
      declarations: [AppComponent]
    });
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
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
});
