import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { startLoginFlow } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';

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
});
