import { waitForAsync } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ResolveEnd,
  Router,
  RouterEvent,
  RouterStateSnapshot,
} from '@angular/router';

import { ReplaySubject } from 'rxjs';

import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { APPLICATION_INSIGHTS_CONFIG } from './application-insights-module-config';
import { ApplicationInsightsService } from './application-insights.service';

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
        provide: APPLICATION_INSIGHTS_CONFIG,
        useValue: {
          applicationInsightsConfig: {
            instrumentationKey: 'key',
          },
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
      snapshot = ({
        component: { foo: 'bar' },
        firstChild: undefined,
      } as unknown) as ActivatedRouteSnapshot;

      const result = ApplicationInsightsService['getActivatedComponent'](
        snapshot
      );

      expect(result.foo).toEqual('bar');
    });

    it('should return the component of snapshots first child', () => {
      snapshot = ({
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
      } as unknown) as ActivatedRouteSnapshot;

      const result = ApplicationInsightsService['getActivatedComponent'](
        snapshot
      );

      expect(result.king).toEqual('im ring');
    });
  });

  describe('addCustomPropertyToTelemetryData', () => {
    let spy: jasmine.Spy;
    beforeEach(() => {
      spy = spyOn(
        service['appInsights'],
        'addTelemetryInitializer'
      ).and.callThrough();
    });

    it('should call method addTelemetryInitializer', () => {
      service.addCustomPropertyToTelemetryData('foo', 'bar');

      expect(service['appInsights'].addTelemetryInitializer).toHaveBeenCalled();
    });

    it('should register telemetry initializer with correct data properties ', () => {
      service.addCustomPropertyToTelemetryData('foo', 'bar');

      const telemetryItem: ITelemetryItem = ({} as unknown) as ITelemetryItem;
      spy.calls.allArgs()[0][0](telemetryItem);

      const expected = { foo: 'bar' };
      expect(telemetryItem.data).toEqual(expected);
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
    it(
      'should call logPageView',
      waitForAsync(() => {
        const snapshot: RouterStateSnapshot = ({
          root: {
            component: { name: 'MonkeyComponent' },
            firstChild: undefined,
          },
        } as unknown) as RouterStateSnapshot;
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
      })
    );

    it(
      'should NOT call logPageView',
      waitForAsync(() => {
        const snapshot: RouterStateSnapshot = ({
          root: {
            component: undefined,
          },
        } as unknown) as RouterStateSnapshot;
        const resolveEndEvent = new ResolveEnd(
          1,
          '/foo/bar',
          '/foo/bar',
          snapshot
        );

        eventSubject.next(resolveEndEvent);

        service['createRouterSubscription']();

        expect(service.logPageView).not.toHaveBeenCalled();
      })
    );
  });
});
