import { NavigationEnd } from '@angular/router';

import { combineLatest, of, take } from 'rxjs';

import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import { Stub } from './shared/test/stub.class';
import { ValidationHelper } from './shared/utils/validation/validation-helper';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = Stub.getForEffect<AppComponent>({
      component: AppComponent,
      providers: [
        Stub.getRouterProvider(),
        Stub.getAlertServiceProvider(),
        Stub.getMsalServiceProvider(),
        Stub.getMsalBroadcastServiceProvider(),
        Stub.getStoreProvider({
          'azure-auth': {
            accountInfo: 'test-user',
            profileImage: { url: 'test-image-url' },
          },
        }),
        Stub.getActivatedRouteProvider(),
        Stub.getUserServiceProvider(),
        Stub.getDateAdapterProvider(),
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
    it('should return true if the current URL matches a route with tab navigation', (done) => {
      const mockRoutesWithTabNavigation = [
        appRoutes.root.path,
        appRoutes.todos.path,
        ...appRoutes.functions.salesSuite.map((route) => route.path),
        ...appRoutes.functions.demandSuite.map((route) => route.path),
        ...appRoutes.functions.general.map((route) => route.path),
      ];
      const mockEvent = new NavigationEnd(1, '/test-url', '/test-url');
      const routerEvents$ = component['router'].events as any;
      jest
        .spyOn(component as any, 'getRelativeUrl')
        .mockReturnValue(mockRoutesWithTabNavigation[0]);

      component['showTabNavigationOnPage$']().subscribe((result) => {
        expect(result).toBe(true);
        done();
      });

      routerEvents$.next(mockEvent);
    });

    it('should filter only NavigationEnd events', (done) => {
      const mockEvent = new NavigationEnd(1, '/test-url', '/test-url');
      const routerEvents$ = component['router'].events as any;
      const nonNavigationEndEvent = { type: 'OtherEvent' };

      jest
        .spyOn(component as any, 'getRelativeUrl')
        .mockReturnValue(appRoutes.root.path);

      component['showTabNavigationOnPage$']().subscribe((result) => {
        expect(result).toBe(true);
        done();
      });

      routerEvents$.next(nonNavigationEndEvent); // Should be ignored
      routerEvents$.next(mockEvent); // Should trigger the observable
    });

    it('should call getRelativeUrl with the correct URL', (done) => {
      const mockEvent = new NavigationEnd(1, '/test-url', '/test-url');
      const routerEvents$ = component['router'].events as any;
      const getRelativeUrlSpy = jest
        .spyOn(component as any, 'getRelativeUrl')
        .mockReturnValue(appRoutes.root.path);

      component['showTabNavigationOnPage$']().subscribe(() => {
        expect(getRelativeUrlSpy).toHaveBeenCalledWith('/test-url');
        done();
      });

      routerEvents$.next(mockEvent);
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
  });
});
