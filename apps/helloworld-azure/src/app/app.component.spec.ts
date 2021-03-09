import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let store: MockStore;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      RouterTestingModule,
      HeaderModule,
      FooterModule,
      NoopAnimationsModule,
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

  test(`should have as title 'helloworld-azure'`, () => {
    expect(component.platformTitle).toEqual('Hello World Azure');
  });

  describe('ngOnInit', () => {
    test('should call getUserName', () => {
      store.dispatch = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
    });
  });
});
