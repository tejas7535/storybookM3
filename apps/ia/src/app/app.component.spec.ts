import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

import { ReplaySubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { FilterSectionModule } from './filter-section/filter-section.module';

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: '/legal/foo',
};

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    detectChanges: false,
    imports: [
      NoopAnimationsModule,
      MatButtonModule,
      PushModule,
      MatProgressSpinnerModule,
      FilterSectionModule,
      MatTabsModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
    ],
    providers: [
      provideMockStore(),
      {
        provide: Router,
        useValue: routerMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'Insight Attrition'`, () => {
    expect(component.title).toEqual('Insight Attrition');
  });

  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
    });

    test('should call handleCurrentRoute', () => {
      component.handleCurrentRoute = jest.fn();

      component.ngOnInit();

      expect(component.handleCurrentRoute).toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('handleCurrentRoute', () => {
    test(
      'should consider initial routing event - legal route active',
      marbles((m) => {
        component.handleCurrentRoute();

        m.expect(component.isLegalRouteActive$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should consider initial routing event - legal route inactive',
      marbles((m) => {
        routerMock.url = '/';
        component.handleCurrentRoute();

        m.expect(component.isLegalRouteActive$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should consider new routing events - new legal routing',
      marbles((m) => {
        routerMock.url = '/';
        component.handleCurrentRoute();

        const newEvent = new NavigationEnd(1, '/legal/bar', '/legal/bar');
        eventSubject.next(newEvent);

        m.expect(component.isLegalRouteActive$).toBeObservable(
          m.cold('(ab)', { a: false, b: true })
        );
      })
    );

    test(
      'should consider new routing events - fluctuation analytics',
      marbles((m) => {
        routerMock.url = '/';
        component.handleCurrentRoute();

        const newEvent = new NavigationEnd(
          1,
          '/fluctuation-analytics',
          '/fluctuation-analytics'
        );
        eventSubject.next(newEvent);

        m.expect(component.isFluctuationAnalyticsPageActive$).toBeObservable(
          m.cold('(ab)', { a: false, b: true })
        );
      })
    );

    test(
      'should consider new routing events - new non legal routing',
      marbles((m) => {
        routerMock.url = '/';
        component.handleCurrentRoute();

        const newEvent = new NavigationEnd(1, '/foo/bar', '/foo/bar');
        eventSubject.next(newEvent);

        m.expect(component.isLegalRouteActive$).toBeObservable(
          m.cold('(ab)', { a: false, b: false })
        );
      })
    );
  });
});
