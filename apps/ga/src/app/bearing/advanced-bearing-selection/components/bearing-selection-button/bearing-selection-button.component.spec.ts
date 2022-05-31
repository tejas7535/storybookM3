import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MockModule } from 'ng-mocks';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BearingSelectionButtonComponent } from './bearing-selection-button.component';

describe('BearingSelectionButtonComponent', () => {
  let component: BearingSelectionButtonComponent;
  let spectator: Spectator<BearingSelectionButtonComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingSelectionButtonComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(ReactiveComponentModule),
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            extendedSearch: {
              resultList: [],
            },
          },
        },
      }),
    ],
    declarations: [BearingSelectionButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
