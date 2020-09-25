import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { startLoginFlow } from '@schaeffler/auth';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null, // tslint:disable-line no-null-keyword
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AppComponent', () => {
  let component: AppComponent;
  let store: MockStore;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [HeaderModule, MatButtonModule, RouterTestingModule, FooterModule],
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

  test(`should have as title 'GOLDWIND'`, () => {
    expect(component.title).toEqual('Goldwind');
  });

  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
    });
  });
});
