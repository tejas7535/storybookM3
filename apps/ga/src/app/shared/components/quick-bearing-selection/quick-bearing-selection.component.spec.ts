import { ReactiveFormsModule } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { resetBearing, selectBearing } from '@ga/core/store';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

describe('QuickBearingSelectionComponent', () => {
  let component: QuickBearingSelectionComponent;
  let spectator: Spectator<QuickBearingSelectionComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: QuickBearingSelectionComponent,
    imports: [
      MockModule(ReactiveFormsModule),
      MockModule(PushModule),
      MockModule(SearchAutocompleteModule),
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
    ],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
    translocoService = spectator.inject(TranslocoService);
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch reset bearing action', () => {
      component.resetOnInit = true;

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());
    });

    it('should reset the search on language change', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'ru');

      component.ngOnInit();

      translocoService.langChanges$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(resetBearing());

        done();
      });
    });
  });

  describe('handleBearingSelection', () => {
    it('should dispatch select bearing and navigate to parameters', () => {
      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
    });

    it('should reset the search', () => {
      component.handleBearingSelection(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());
    });
  });
});
