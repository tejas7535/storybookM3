import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { startLoginFlow } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';
import { ReplaySubject } from 'rxjs';
import { RoutePath } from './app-routing.enum';

import { AppComponent } from './app.component';

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routerMock = {
  navigate: jasmine.createSpy,
  events: eventSubject.asObservable(),
  url: 'someUrl',
};

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      HeaderModule,
      MatButtonModule,
      RouterTestingModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            user: {
              username: 'Jefferson',
            },
          },
        },
      }),
      {
        provide: Router,
        useValue: routerMock,
      },
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Init component', () => {
    test('should be initialize', () => {
      store.dispatch = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
    });
  });

  describe('link', () => {
    it('should return nothing by default', () => {
      expect(component.link).toEqual(false);
    });

    it('should return a link to overview only when in hardness-conversion', () => {
      component.url = `/${RoutePath.HardnessConverterPath}`;
      expect(component.link).toEqual(`/${RoutePath.OverviewPath}`);
    });

    it('should get the link from router', () => {
      eventSubject.next(new NavigationEnd(1, 'url', 'fullUrl'));

      expect(component.url).toEqual('url');
    });
  });
});
