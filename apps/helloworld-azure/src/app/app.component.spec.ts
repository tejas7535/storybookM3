import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';
import { FooterModule } from '@schaeffler/footer';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let store: MockStore;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      RouterTestingModule,
      AppShellModule,
      NoopAnimationsModule,
      FooterModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: {
              name: 'Jefferson',
            },
            profileImage: {
              url: 'img',
            },
          },
        },
      }),
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

  test(`should have as title 'helloworld-azure'`, () => {
    expect(component.platformTitle).toEqual('Hello World Azure');
  });

  describe('ngOnInit', () => {
    test('should call getUserName', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
    });
  });
});
