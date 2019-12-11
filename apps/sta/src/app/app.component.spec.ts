import { of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { BreadcrumbModule } from './shared/breadcrumb/breadcrumb.module';

import { AppComponent } from './app.component';
import { ResultComponent } from './shared/result/result.component';

import { AuthService } from './core/auth.service';
import { DataService } from './shared/result/data.service';

@Component({ selector: 'sta-result', template: '' })
class ResultStubComponent implements Partial<ResultComponent> {
  tags$;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AuthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BreadcrumbModule,
        FooterModule,
        HeaderModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SettingsSidebarModule,
        SidebarModule
      ],
      declarations: [AppComponent, ResultStubComponent],
      providers: [
        DataService,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    service.initAuth = jest.fn();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;

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
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(service.initAuth).toHaveBeenCalled();
  });

  it(`should have as title 'Schaeffler Text Assistant'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Schaeffler Text Assistant');
  });

  describe('ngOnInit()', () => {
    test('should set Observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isInitialState$).toBeDefined();
      expect(component.subscription).toBeDefined();
    });

    test('should set settingsSidebarOpen to true initialy', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await fixture.whenStable();

      expect(component.settingsSidebarOpen).toBeTruthy();
    });

    test('should set settingsSidebarOpen to true when data avl', async () => {
      component['dataService'].isDataAvailable = jest
        .fn()
        .mockImplementation(() => of(true));
      component[
        'dataService'
      ].isInitialEmptyState = jest.fn().mockImplementation(() => of(false));

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await fixture.whenStable();

      expect(component.settingsSidebarOpen).toBeTruthy();
    });

    test('should set settingsSidebarOpen to false when no data and not initial', fakeAsync(() => {
      component['dataService'].isDataAvailable = jest
        .fn()
        .mockImplementation(() => of(false));
      component[
        'dataService'
      ].isInitialEmptyState = jest.fn().mockImplementation(() => of(false));
      component.settingsSidebarOpen = true;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.settingsSidebarOpen).toBeFalsy();
    }));
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('settingsSidebarOpenedChanges', () => {
    test('should set settingsSidebarOpen to provided parameter', () => {
      const open = false;
      component.settingsSidebarOpen = true;

      component.settingsSidebarOpenedChanges(open);

      expect(component.settingsSidebarOpen).toBeFalsy();
    });
  });
});
