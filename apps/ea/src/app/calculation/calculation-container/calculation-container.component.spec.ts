import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationContainerComponent } from './calculation-container.component';

describe('CalculationContainerComponent', () => {
  let component: CalculationContainerComponent;
  let spectator: Spectator<CalculationContainerComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationContainerComponent,
    imports: [
      // Material Modules
      MockModule(MatDividerModule),

      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ResultOverlay', () => {
    it('should show the result overlay', () => {
      expect(spectator.query('ea-calculation-result-preview')).toBeTruthy();
    });
  });
});
