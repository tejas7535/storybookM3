import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { startLoginFlow } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';
import { FilterSectionModule } from './filter-section/filter-section.module';

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
      MatProgressSpinnerModule,
      FilterSectionModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            user: {
              username: 'Hans',
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

  test(`should have as title 'Insight Attrition'`, () => {
    expect(component.title).toEqual('Insight Attrition');
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
