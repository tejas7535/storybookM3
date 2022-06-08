import { ReactiveFormsModule } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectBearing } from '@ga/core/store';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

describe('QuickBearingSelectionComponent', () => {
  let component: QuickBearingSelectionComponent;
  let spectator: Spectator<QuickBearingSelectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: QuickBearingSelectionComponent,
    imports: [
      MockModule(ReactiveFormsModule),
      MockModule(PushModule),
      MockModule(SearchAutocompleteModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore()],
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

  describe('handleBearingSelection', () => {
    it('should dispatch select bearing and navigate to parameters', () => {
      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
    });

    it('should dispatch undefined bearing', () => {
      component.handleBearingSelection(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: undefined })
      );
    });
  });
});
