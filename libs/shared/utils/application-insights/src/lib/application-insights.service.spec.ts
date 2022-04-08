import { waitForAsync } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveEnd,
  Router,
  RouterEvent,
  RouterStateSnapshot,
} from '@angular/router';

import { of, ReplaySubject } from 'rxjs';

import { CookiesGroups, OneTrustService } from '@altack/ngx-onetrust';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CustomProps } from './application-insights.models';
import { ApplicationInsightsService } from './application-insights.service';
import { APPLICATION_INSIGHTS_CONFIG } from './application-insights-module-config';

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: '/foo/bar',
};

describe('ApplicationInsightService', () => {
  let service: ApplicationInsightsService;
  let spectator: SpectatorService<ApplicationInsightsService>;

  const serviceFactory = createServiceFactory({
    service: ApplicationInsightsService,
    providers: [
      { provide: Router, useValue: routerMock },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            url: '/legal',
            component: { name: 'MockComponent' },
            firstChild: undefined,
          },
        },
      },
      {
        provide: APPLICATION_INSIGHTS_CONFIG,
        useValue: {
          applicationInsightsConfig: {
            instrumentationKey: 'key',
          },
        },
      },
      {
        provide: OneTrustService,
        useValue: {
          consentChanged$: () => of(new Map()),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = serviceFactory();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getActivatedComponent', () => {
    let snapshot: ActivatedRouteSnapshot;
    it('should return the snapshots component', () => {
      snapshot = {
        component: { foo: 'bar' },
        firstChild: undefined,
      } as unknown as ActivatedRouteSnapshot;

      const result =
        ApplicationInsightsService['getActivatedComponent'](snapshot);

      expect(result.foo).toEqual('bar');
    });

    it('should return the component of snapshots first child', () => {
      snapshot = {
        component: { foo: 'bar' },
        firstChild: {
          component: 'lala',
          firstChild: {
            component: {
              king: 'im ring',
              firstChild: undefined,
            },
          },
        },
      } as unknown as ActivatedRouteSnapshot;

      const result =
        ApplicationInsightsService['getActivatedComponent'](snapshot);

      expect(result.king).toEqual('im ring');
    });
  });

  describe('addCustomPropertyToTelemetryData', () => {
    beforeEach(() => {
      jest.spyOn(service['appInsights'], 'addTelemetryInitializer');
    });

    it('should call method addTelemetryInitializer', () => {
      service.addCustomPropertyToTelemetryData('foo', 'bar');

      expect(service['appInsights'].addTelemetryInitializer).toHaveBeenCalled();
    });
  });

  describe('initTracking', () => {
    beforeEach(() => {
      service['startTracking'] = jest.fn();
      service['addCustomPropertyToTelemetryData'] = jest.fn();
      service['trackInitalPageView'] = jest.fn();
      service['deleteCookies'] = jest.fn();
    });
    it('should call startTracking, add customProps and trackInitalPageView when consent given', () => {
      const mockTag = 'mockTag';
      const mockValue = 'mockValue';

      const customProps: CustomProps = {
        tag: mockTag,
        value: mockValue,
      };

      const cookieMap = new Map<CookiesGroups, boolean>();
      cookieMap.set(CookiesGroups.PerformanceCookies, true);

      service['oneTrustService'].consentChanged$ = () => of(cookieMap);

      service.initTracking(customProps);

      expect(service['startTracking']).toHaveBeenCalledTimes(1);
      expect(service['addCustomPropertyToTelemetryData']).toHaveBeenCalledTimes(
        1
      );
      expect(service['addCustomPropertyToTelemetryData']).toHaveBeenCalledWith(
        mockTag,
        mockValue
      );
      expect(service['trackInitalPageView']).toHaveBeenCalledTimes(1);
    });

    it('should deleteCookies when consent declined', () => {
      const cookieMap = new Map<CookiesGroups, boolean>();
      cookieMap.set(CookiesGroups.PerformanceCookies, false);

      service['oneTrustService'].consentChanged$ = () =>
        of(cookieMap, cookieMap);

      service.initTracking();

      expect(service['deleteCookies']).toHaveBeenCalledTimes(1);
    });
  });

  describe('startTracking', () => {
    beforeEach(() => {
      service['createRouterSubscription'] = jest.fn();
    });
    it('should call loadAppInsights', () => {
      service.startTracking(false);

      expect(service['createRouterSubscription']).toHaveBeenCalledTimes(1);
    });
  });

  describe('logPageView', () => {
    it('should call trackPageView', () => {
      service['appInsights'].trackPageView = jest.fn();

      const name = 'TabComponent';
      const uri = '/tab?foo=bar';

      service.logPageView(name, uri);

      expect(service['appInsights'].trackPageView).toHaveBeenCalledWith({
        name,
        uri,
      });
    });
  });

  describe('logEvent', () => {
    it('should call trackEvent', () => {
      service['appInsights'].trackEvent = jest.fn();

      const name = 'Select Monkey';
      const properties = { foo: 'bar' };

      service.logEvent(name, properties);

      expect(service['appInsights'].trackEvent).toHaveBeenCalledWith(
        {
          name,
        },
        properties
      );
    });
  });

  describe('logMetric', () => {
    it('should call trackMetric', () => {
      service['appInsights'].trackMetric = jest.fn();

      const name = 'SuccessRate';
      const average = 100;
      const properties = { foo: 'bar' };

      service.logMetric(name, average, properties);

      expect(service['appInsights'].trackMetric).toHaveBeenCalledWith(
        {
          name,
          average,
        },
        properties
      );
    });
  });

  describe('logException', () => {
    it('should call trackException', () => {
      service['appInsights'].trackException = jest.fn();

      const error = new Error('Monkey overflow');
      const severityLevel = 7;

      service.logException(error, severityLevel);

      expect(service['appInsights'].trackException).toHaveBeenCalledWith({
        severityLevel,
        exception: error,
      });
    });
  });

  describe('logTrace', () => {
    it('should call trackTrace', () => {
      service['appInsights'].trackTrace = jest.fn();

      const message = 'Select Monkey';
      const properties = { foo: 'bar' };

      service.logTrace(message, properties);

      expect(service['appInsights'].trackTrace).toHaveBeenCalledWith(
        {
          message,
        },
        properties
      );
    });
  });

  describe('createRouterSubscription', () => {
    beforeEach(() => {
      service.logPageView = jest.fn();
    });
    it('should call logPageView', waitForAsync(() => {
      const snapshot: RouterStateSnapshot = {
        root: {
          component: { name: 'MonkeyComponent' },
          firstChild: undefined,
        },
      } as unknown as RouterStateSnapshot;
      const resolveEndEvent = new ResolveEnd(
        1,
        '/foo/bar',
        '/foo/bar',
        snapshot
      );

      eventSubject.next(resolveEndEvent);

      service['createRouterSubscription']();

      expect(service.logPageView).toHaveBeenCalledWith(
        'MonkeyComponent',
        '/foo/bar'
      );
    }));

    it('should NOT call logPageView', waitForAsync(() => {
      const snapshot: RouterStateSnapshot = {
        root: {
          component: undefined,
        },
      } as unknown as RouterStateSnapshot;
      const resolveEndEvent = new ResolveEnd(
        1,
        '/foo/bar',
        '/foo/bar',
        snapshot
      );

      eventSubject.next(resolveEndEvent);

      service['createRouterSubscription']();

      expect(service.logPageView).not.toHaveBeenCalled();
    }));
  });

  describe('trackPageView', () => {
    beforeEach(() => {
      service.logPageView = jest.fn();
    });
    it('should call logPageView', () => {
      const snapshot = {
        url: '/legal',
        component: { name: 'MockComponent' },
        firstChild: undefined,
      } as unknown as ActivatedRouteSnapshot;

      service['trackPageView'](snapshot, '/foo/bar');

      expect(service.logPageView).toHaveBeenCalledWith(
        'MockComponent',
        '/foo/bar'
      );
    });
  });

  describe('trackInitalPageView', () => {
    beforeEach(() => {
      service['trackPageView'] = jest.fn();
    });
    it('should call logPageView', () => {
      const snapshot = {
        url: '/legal',
        component: { name: 'MockComponent' },
        firstChild: undefined,
      } as unknown as ActivatedRouteSnapshot;

      service['trackInitalPageView']();

      expect(service['trackPageView']).toHaveBeenCalledWith(
        snapshot,
        '/foo/bar'
      );
    });
  });

  describe('deleteCookies', () => {
    beforeEach(() => {
      jest.spyOn(service['appInsights']['getCookieMgr'](), 'del');
    });
    it('should delete cookies', () => {
      service.deleteCookies();

      expect(service['appInsights']['getCookieMgr']().del).toHaveBeenCalled();
    });
  });
});
