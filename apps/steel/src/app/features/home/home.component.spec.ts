import { Observable, Subscriber } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { BreakpointService } from '@schaeffler/shared/responsive';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import {
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SettingsSidebarModule,
  SidebarMode,
  SidebarModule,
  SidebarService
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { HomeComponent } from './home.component';

import * as en from '../../../assets/i18n/en.json';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let sidebarService: SidebarService;
  let breakpointObserverMock: Subscriber<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FooterModule,
        HeaderModule,
        HttpClientTestingModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule,
        SettingsSidebarModule,
        SidebarModule,
        ScrollToTopModule,
        NoopAnimationsModule,
        provideTranslocoTestingModule({ en })
      ],
      declarations: [HomeComponent],
      providers: [
        BreakpointService,
        SidebarService,
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    sidebarService = TestBed.get(SidebarService);
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

  /**
   * Fake Observer to emit fake stuff
   */
  const fakeObservable = new Observable(observer => {
    breakpointObserverMock = observer;

    return {
      unsubscribe(): any {}
    };
  });

  test('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    test('should set Observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.subscription).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();
      component.destroy$.next = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
      expect(component.destroy$.next).toHaveBeenCalled();
    });
  });

  describe('toggleSidebar()', () => {
    test('should set next sidebarToggled value', () => {
      const sidebarMode = SidebarMode.Open;
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['sidebarToggled'], 'next');

      component.toggleSidebar();
      breakpointObserverMock.next(sidebarMode);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(SidebarMode.Open);
    });

    test('should only set next sidebarToggled value in one time ToggleSidebarAction()', () => {
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['sidebarToggled'], 'next');
      component.toggleSidebar();

      breakpointObserverMock.next(SidebarMode.Open);
      expect(spy).toHaveBeenCalledWith(SidebarMode.Open);

      breakpointObserverMock.next(SidebarMode.Closed);
      expect(spy).not.toHaveBeenCalledWith(SidebarMode.Closed);
    });
  });

  describe('handleSidebarMode', () => {
    test('should subscribe to getSidebarMode', () => {
      const spy = spyOn(sidebarService, 'getSidebarMode').and.callThrough();

      component['handleSidebarMode']();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleSidebarToggledObservable', () => {
    test('should leave old mode as undefined if it was undefined', () => {
      component.mode = undefined;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toBeUndefined();
    });

    test('should set mode to open when old mode is "Closed"', () => {
      component.mode = SidebarMode.Closed;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Open);
    });

    test('should set mode to open when old mode is "Minified"', () => {
      component.mode = SidebarMode.Minified;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Open);
    });

    test('should set mode to Minified when old mode is "Open" and new is "Open"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Minified);
    });

    test('should set mode to Minified when old mode is "Open" and new is "Minified"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Minified);

      expect(component.mode).toEqual(SidebarMode.Minified);
    });

    test('should set mode to Closed when old mode is "Open" and new is "Closed"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Closed);

      expect(component.mode).toEqual(SidebarMode.Closed);
    });
  });
});
