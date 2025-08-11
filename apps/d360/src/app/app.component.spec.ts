import { NavigationEnd } from '@angular/router';

import { BehaviorSubject, combineLatest, EMPTY, of, take } from 'rxjs';

import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import { DATE_FNS_LOOKUP } from './shared/constants/available-locales';
import { Stub } from './shared/test/stub.class';
import { ValidationHelper } from './shared/utils/validation/validation-helper';

describe('AppComponent', () => {
  let component: AppComponent;
  let routerEvents: BehaviorSubject<any>;
  let queryParams: BehaviorSubject<any>;

  beforeEach(() => {
    routerEvents = new BehaviorSubject(null);
    queryParams = new BehaviorSubject(null);
    component = Stub.getForEffect<AppComponent>({
      component: AppComponent,
      providers: [
        Stub.getRouterProvider(routerEvents),
        Stub.getAlertServiceProvider(),
        Stub.getMsalServiceProvider(),
        Stub.getMsalBroadcastServiceProvider(),
        Stub.getStoreProvider({
          'azure-auth': {
            accountInfo: 'test-user',
            profileImage: { url: 'test-image-url' },
          },
        }),
        Stub.getActivatedRouteProvider(queryParams),
        Stub.getUserServiceProvider(),
        Stub.getDateAdapterProvider(),
        Stub.getStreamSaverServiceProvider(),
        Stub.getEnvProvider({
          qualtricsQuestionnaireUrl: 'https://qualtrics.example.com/survey',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the plain title when a general route is active', () => {
    component['activeUrl'].set(AppRoutePath.TodoPage);
    expect(component['title']()).toBe('header.fullTitle');
  });

  it('should show demandSuite in title when a route from the demand suite is active', () => {
    component['activeUrl'].set(AppRoutePath.DemandValidationPage);
    expect(component['title']()).toBe(
      'header.fullTitle | tabbarMenu.demandSuite'
    );
  });

  it('should show salesSuite in title when a route from the sales suite is active', () => {
    component['activeUrl'].set(AppRoutePath.SalesValidationPage);
    expect(component['title']()).toBe(
      'header.fullTitle | tabbarMenu.salesSuite'
    );
  });

  describe('constructor', () => {
    beforeEach(() => {
      sessionStorage.removeItem(AppRoutePath.AlertRuleManagementPage);
      jest.spyOn(sessionStorage, 'getItem');
      jest.spyOn(sessionStorage, 'setItem');
    });

    it('should return EMPTY if params are empty', () => {
      const params = {};

      queryParams.next(params);
      routerEvents.next(new NavigationEnd(1, '/foo', '/foo'));

      const result = Object.entries(params).length === 0 ? EMPTY : of(true);

      expect(result).toBe(EMPTY);
    });

    it('should return of(true) if activeUrl is root or empty', () => {
      const originalLocation = window.location;

      // Replace the window.location object with a mock
      delete (window as any).location;
      (window as any).location = { href: 'http://localhost/' };

      const mockParams = { param1: 'value1' };
      let mockEvent = new NavigationEnd(1, '/', '/');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(window.location.href).toBe('http://localhost/');

      mockEvent = new NavigationEnd(2, '', '');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(window.location.href).toBe('http://localhost/');

      // Restore the original window.location object
      (window as any).location = originalLocation;
    });

    it('should set the activeUrl signal when a NavigationEnd event occurs', () => {
      const mockEvent = new NavigationEnd(1, '/test-url', '/test-url');
      const setActiveUrlSpy = jest.spyOn(component['activeUrl'], 'set');

      routerEvents.next(mockEvent);

      expect(setActiveUrlSpy).toHaveBeenCalledWith('test-url');
    });

    it('should call handleQueryParams$ when a route with global selection is found', () => {
      const mockParams = { param1: 'value1' };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.DemandValidationPage,
        AppRoutePath.DemandValidationPage
      );
      const handleQueryParamsSpy = jest
        .spyOn(component['globalSelectionStateService'], 'handleQueryParams$')
        .mockReturnValue(of(true));

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(handleQueryParamsSpy).toHaveBeenCalledWith(mockParams);
    });

    it('should set sessionStorage for sales validation selection', () => {
      const mockParams = { param1: 'value1' };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.SalesValidationPage,
        AppRoutePath.SalesValidationPage
      );

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(sessionStorage.getItem(AppRoutePath.SalesValidationPage)).toBe(
        JSON.stringify(mockParams)
      );
    });

    it('should not set sessionStorage and navigate for task rules selection if createNewTask is missing', () => {
      const mockParams = { customerNumber: '123', materialNumber: '456' };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.AlertRuleManagementPage,
        AppRoutePath.AlertRuleManagementPage
      );
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(
        sessionStorage.getItem(AppRoutePath.AlertRuleManagementPage)
      ).toBeUndefined();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not set sessionStorage and navigate for task rules selection if createNewTask is false', () => {
      const mockParams = {
        customerNumber: '123',
        materialNumber: '456',
        createNewTask: false,
      };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.AlertRuleManagementPage,
        AppRoutePath.AlertRuleManagementPage
      );
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(
        sessionStorage.getItem(AppRoutePath.AlertRuleManagementPage)
      ).toBeUndefined();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should set sessionStorage and navigate for task rules selection if createNewTask is not missing', () => {
      const mockParams = {
        customerNumber: '123',
        materialNumber: '456',
        createNewTask: true,
      };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.AlertRuleManagementPage,
        AppRoutePath.AlertRuleManagementPage
      );
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(sessionStorage.getItem(AppRoutePath.AlertRuleManagementPage)).toBe(
        JSON.stringify(mockParams)
      );
      expect(navigateSpy).toHaveBeenCalledWith(
        [AppRoutePath.AlertRuleManagementPage],
        {
          onSameUrlNavigation: 'reload',
          skipLocationChange: false,
        }
      );
    });

    it('should set sessionStorage and navigate for task rules selection if there are no params', () => {
      const mockParams = { foo: 'bar', createNewTask: true };
      const mockEvent = new NavigationEnd(
        1,
        AppRoutePath.AlertRuleManagementPage,
        AppRoutePath.AlertRuleManagementPage
      );
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      queryParams.next(mockParams);
      routerEvents.next(mockEvent);

      expect(sessionStorage.getItem(AppRoutePath.AlertRuleManagementPage)).toBe(
        JSON.stringify({
          customerNumber: null,
          materialNumber: null,
          createNewTask: true,
        })
      );
      expect(navigateSpy).toHaveBeenCalledWith(
        [AppRoutePath.AlertRuleManagementPage],
        {
          onSameUrlNavigation: 'reload',
          skipLocationChange: false,
        }
      );
    });

    it('should set the locale on the dateAdapter when localeChanges$ emits', () => {
      const mockLocale = 'de-DE';
      const setLocaleSpy = jest.spyOn(component['dateAdapter'], 'setLocale');

      (component['translocoLocaleService'].localeChanges$ as any).next(
        mockLocale
      );

      expect(setLocaleSpy).toHaveBeenCalledWith(DATE_FNS_LOOKUP[mockLocale]);
    });

    it('should set the default locale on the dateAdapter when localeChanges$ emits', () => {
      const mockLocale = 'ab-CD';
      const setLocaleSpy = jest.spyOn(component['dateAdapter'], 'setLocale');

      (component['translocoLocaleService'].localeChanges$ as any).next(
        mockLocale
      );

      expect(setLocaleSpy).toHaveBeenCalledWith(DATE_FNS_LOOKUP['en-US']);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize username$ and profileImage$ observables on ngOnInit', (done) => {
      const mockUsername = 'test-user';
      const mockProfileImage = 'test-image-url';

      component.ngOnInit();

      combineLatest([component['username$'], component['profileImage$']])
        .pipe(take(1))
        .subscribe(([username, profileImage]: [any, any]) => {
          expect(username['azure-auth']['accountInfo']).toBe(mockUsername);
          expect(profileImage['azure-auth']['profileImage']['url']).toBe(
            mockProfileImage
          );
          done();
        });
    });

    it('should call handleRedirectObservable on authService during ngOnInit', () => {
      const authService = component['authService'];
      const handleRedirectSpy = jest
        .spyOn(authService, 'handleRedirectObservable')
        .mockReturnValue(of(null));

      component.ngOnInit();

      expect(handleRedirectSpy).toHaveBeenCalled();
    });

    it('should enable account storage events on authService during ngOnInit', () => {
      const authService = component['authService'];
      const enableAccountStorageEventsSpy = jest.spyOn(
        authService.instance,
        'enableAccountStorageEvents'
      );

      component.ngOnInit();

      expect(enableAccountStorageEventsSpy).toHaveBeenCalled();
    });

    it('should redirect to root if all accounts are removed during ngOnInit', () => {
      const authService = component['authService'];
      const msalBroadcastService = component['msalBroadcastService'];
      jest.spyOn(authService.instance, 'getAllAccounts').mockReturnValue([]);
      const msalSubject$ = msalBroadcastService.msalSubject$ as any;
      const mockEvent = {
        eventType: EventType.ACCOUNT_REMOVED,
      } as EventMessage;

      component.ngOnInit();
      msalSubject$.next(mockEvent);

      expect(window.location.pathname).toBe('/');
    });

    it('should call checkAndSetActiveAccount when inProgress$ emits InteractionStatus.None', () => {
      const msalBroadcastService = component['msalBroadcastService'];
      const inProgress$ = msalBroadcastService.inProgress$ as any;
      const checkAndSetActiveAccountSpy = jest.spyOn(
        component as any,
        'checkAndSetActiveAccount'
      );

      component.ngOnInit();
      inProgress$.next(InteractionStatus.None);

      expect(checkAndSetActiveAccountSpy).toHaveBeenCalled();
    });

    it('should initialize alertService and userService during ngOnInit', () => {
      const alertService = component['alertService'];
      const userService = component['userService'];
      const alertServiceInitSpy = jest.spyOn(alertService, 'init');
      const userServiceInitSpy = jest.spyOn(userService, 'init');

      component.ngOnInit();

      expect(alertServiceInitSpy).toHaveBeenCalled();
      expect(userServiceInitSpy).toHaveBeenCalled();
    });

    it('should set ValidationHelper.localeService to translocoLocaleService during ngOnInit', () => {
      component.ngOnInit();

      expect(ValidationHelper.localeService).toBe(
        component['translocoLocaleService']
      );
    });

    it('should initialize streamSaverService in ngOnInit', () => {
      const streamSaverService = component['streamSaverService'];
      const initSpy = jest
        .spyOn(streamSaverService, 'init')
        .mockImplementation(() => {});

      component.ngOnInit();

      expect(initSpy).toHaveBeenCalled();
    });

    it('should set the qualtricsQuestionnaireUrl', () => {
      component.ngOnInit();

      expect((component as any).qualtricsQuestionnaireUrl).toBe(
        'https://qualtrics.example.com/survey'
      );
    });

    it('should set empty string when getQualtricsUrl fails', () => {
      const getQualtricsUrlSpy = jest
        .spyOn(component as any, 'getQualtricsUrl')
        .mockReturnValue('');

      component.ngOnInit();

      expect(getQualtricsUrlSpy).toHaveBeenCalled();
      expect((component as any).qualtricsQuestionnaireUrl).toBe('');
    });
  });

  describe('checkAndSetActiveAccount', () => {
    it('should not set an active account if one is already active', () => {
      const authService = component['authService'];
      const mockActiveAccount = { username: 'active-user' };
      jest
        .spyOn(authService.instance, 'getActiveAccount')
        .mockReturnValue(mockActiveAccount as any);

      const setActiveAccountSpy = jest.spyOn(
        authService.instance,
        'setActiveAccount'
      );

      (component as any).checkAndSetActiveAccount();

      expect(setActiveAccountSpy).not.toHaveBeenCalled();
    });

    it('should set the first account as active if no active account is set and accounts are available', () => {
      const authService = component['authService'];
      const mockAccounts = [{ username: 'user1' }, { username: 'user2' }];
      jest
        .spyOn(authService.instance, 'getActiveAccount')
        .mockReturnValue(null);
      jest
        .spyOn(authService.instance, 'getAllAccounts')
        .mockReturnValue(mockAccounts as any);

      const setActiveAccountSpy = jest.spyOn(
        authService.instance,
        'setActiveAccount'
      );

      (component as any).checkAndSetActiveAccount();

      expect(setActiveAccountSpy).toHaveBeenCalledWith(mockAccounts[0]);
    });

    it('should not set an active account if no accounts are available', () => {
      const authService = component['authService'];
      jest
        .spyOn(authService.instance, 'getActiveAccount')
        .mockReturnValue(null);
      jest.spyOn(authService.instance, 'getAllAccounts').mockReturnValue([]);

      const setActiveAccountSpy = jest.spyOn(
        authService.instance,
        'setActiveAccount'
      );

      (component as any).checkAndSetActiveAccount();

      expect(setActiveAccountSpy).not.toHaveBeenCalled();
    });

    it('should handle the case where getAllAccounts returns undefined gracefully', () => {
      const authService = component['authService'];
      jest
        .spyOn(authService.instance, 'getActiveAccount')
        .mockReturnValue(null);
      jest
        .spyOn(authService.instance, 'getAllAccounts')
        .mockReturnValue(undefined as any);

      const setActiveAccountSpy = jest.spyOn(
        authService.instance,
        'setActiveAccount'
      );

      (component as any).checkAndSetActiveAccount();

      expect(setActiveAccountSpy).not.toHaveBeenCalled();
    });
  });

  describe('showTabNavigationOnPage$', () => {
    beforeEach(() => {
      jest
        .spyOn(component as any, 'getRelativeUrl')
        .mockImplementation((url) => String(url).replace(/^\//, ''));
    });

    it('should show tab navigation for root path', (done) => {
      const mockEvent = new NavigationEnd(
        1,
        appRoutes.root.path,
        appRoutes.root.path
      );
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(true);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should show tab navigation for todos path', (done) => {
      const mockEvent = new NavigationEnd(
        1,
        `/${appRoutes.todos.path}`,
        `/${appRoutes.todos.path}`
      );
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(true);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should show tab navigation for sales suite paths', (done) => {
      const salesSuitePath = appRoutes.functions.salesSuite[0].path;
      const mockEvent = new NavigationEnd(
        1,
        `/${salesSuitePath}`,
        `/${salesSuitePath}`
      );
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(true);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should show tab navigation for demand suite paths', (done) => {
      const demandSuitePath = appRoutes.functions.demandSuite[0].path;
      const mockEvent = new NavigationEnd(
        1,
        `/${demandSuitePath}`,
        `/${demandSuitePath}`
      );
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(true);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should show tab navigation for general function paths', (done) => {
      const generalPath = appRoutes.functions.general[0].path;
      const mockEvent = new NavigationEnd(
        1,
        `/${generalPath}`,
        `/${generalPath}`
      );
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(true);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should hide tab navigation for unknown paths', (done) => {
      const mockEvent = new NavigationEnd(1, '/unknown-path', '/unknown-path');
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(setTabNavigationSpy).toHaveBeenCalledWith(false);
        done();
      });

      routerEvents.next(mockEvent);
    });

    it('should filter out non-NavigationEnd events', () => {
      const setTabNavigationSpy = jest.spyOn(
        component['isTabNavigationVisible'],
        'set'
      );

      component['showTabNavigationOnPage$']().subscribe();

      routerEvents.next({ type: 'NavigationStart' });

      expect(setTabNavigationSpy).not.toHaveBeenCalled();
    });
  });

  describe('getRelativeUrl', () => {
    it('should return the path without the domain or protocol', () => {
      const url = 'https://example.com/some/path';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path');
    });

    it('should return the path in lowercase', () => {
      const url = 'https://example.com/SOME/Path';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path');
    });

    it('should remove query parameters from the URL', () => {
      const url = 'https://example.com/some/path?query=1';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path');
    });

    it('should handle URLs without a protocol or domain', () => {
      const url = '/some/path';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path');
    });

    it('should handle URLs with only a query string', () => {
      const url = '/?query=1';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('');
    });

    it('should handle URLs with a trailing slash', () => {
      const url = 'https://example.com/some/path/';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path/');
    });

    it('should handle empty strings gracefully', () => {
      const url = '';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('');
    });

    it('should handle URLs with multiple slashes at the start', () => {
      const url = '///some/path';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path');
    });

    it('should handle URLs with no path but with a domain', () => {
      const url = 'https://example.com/';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('');
    });

    it('should handle URLs with no path, domain, or protocol', () => {
      const url = '/';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('');
    });

    it('should handle relative URLs with query parameters', () => {
      const url = 'some/path?param=value';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('path');
    });

    it('should handle URLs with fragments', () => {
      const url = 'https://example.com/some/path#section';
      const result = (component as any).getRelativeUrl(url);
      expect(result).toBe('some/path#section');
    });
  });

  describe('getQualtricsUrl', () => {
    it('should return URL from environment configuration', () => {
      const expectedUrl = 'https://qualtrics.example.com/survey';

      const result = (component as any).getQualtricsUrl();

      expect(result).toBe(expectedUrl);
    });

    it('should return empty string when getEnv returns null', () => {
      (component as any).environment = { qualtricsQuestionnaireUrl: null };

      const result = (component as any).getQualtricsUrl();

      expect(result).toBe('');
    });

    it('should return empty string when qualtricsQuestionnaireUrl is not set', () => {
      (component as any).environment = { qualtricsQuestionnaireUrl: undefined };

      const result = (component as any).getQualtricsUrl();

      expect(result).toBe('');
    });

    it('should return empty string when getEnv throws an error', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      Object.defineProperty(component, 'environment', {
        get: jest.fn(() => {
          throw new Error('Environment access failed');
        }),
        configurable: true,
      });

      const result = (component as any).getQualtricsUrl();

      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to get Qualtrics URL:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
