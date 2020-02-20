import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HeaderModule,
        SettingsSidebarModule,
        MatButtonModule
      ],
      providers: [],
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
