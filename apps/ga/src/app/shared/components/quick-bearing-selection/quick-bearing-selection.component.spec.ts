import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks';

import { SearchModule } from '@schaeffler/inputs/search';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { resetBearing, searchBearing, selectBearing } from '@ga/core/store';
import { AdvancedBearingButtonComponent } from '@ga/shared/components/advanced-bearing-button';
import { BEARING_SELECTION_STATE_MOCK } from '@ga/testing/mocks';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

describe('QuickBearingSelectionComponent', () => {
  let component: QuickBearingSelectionComponent;
  let spectator: Spectator<QuickBearingSelectionComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: QuickBearingSelectionComponent,
    imports: [
      RouterTestingModule,
      MockModule(ReactiveFormsModule),
      MockDirective(LetDirective),
      MockModule(SearchModule),
      MockComponent(AdvancedBearingButtonComponent),
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearingSelection: {
            ...BEARING_SELECTION_STATE_MOCK,
          },
        },
      }),
    ],
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

    it('should hit search with the current search query on language change', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'ru');

      component.onSearchUpdated('mock search');
      component.ngOnInit();

      translocoService.langChanges$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          searchBearing({ query: 'mock search' })
        );

        done();
      });
    });
  });

  describe('onBearingSelectionButtonClick', () => {
    it('should dispatch select bearing', () => {
      component.onBearingSelectionButtonClick('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
    });

    it('should reset the search', () => {
      component.onBearingSelectionButtonClick(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());
    });
  });

  describe('onSearchUpdated', () => {
    it('should dispatch search bearing', () => {
      component.onSearchUpdated('mock search');

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBearing({ query: 'mock search' })
      );
    });

    it('should reset the search', () => {
      component.onSearchUpdated('m');

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());

      component.onSearchUpdated(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());
    });
  });

  describe('onOptionSelected', () => {
    it('should dispatch select bearing', () => {
      component.onOptionSelected({ id: 'mock_id', title: 'mock_title' });

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'mock_id' })
      );
    });

    it('should reset the search', () => {
      component.onOptionSelected(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(resetBearing());
    });
  });
});
