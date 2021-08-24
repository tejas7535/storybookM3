import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { selectBearing } from './../core/store/actions/bearing/bearing.actions';
import { BearingComponent } from './bearing.component';

describe('BearingComponent', () => {
  let component: BearingComponent;
  let spectator: Spectator<BearingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingComponent,
    imports: [
      RouterTestingModule,
      SearchAutocompleteModule,
      provideTranslocoTestingModule({ en: {} }),
      SubheaderModule,
      ReactiveComponentModule,
      MatButtonModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            search: {
              query: undefined,
              resultList: [],
            },
            extendedSearch: {
              query: undefined,
              bearingDesign: undefined,
              innerDiameter: undefined,
              innerDiameterDeviation: undefined,
              outerDiameter: undefined,
              outerDiameterDeviation: undefined,
              width: undefined,
              widthDeviation: undefined,
              resultList: [],
            },
            loading: false,
            selectedBearing: undefined,
          },
        },
      }),
    ],
    declarations: [BearingComponent],
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

  describe('handleBearingSelection', () => {
    it('should dispatch select bearing and navigate to parameters', () => {
      component['router'].navigate = jest.fn();

      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
      expect(component['router'].navigate).toHaveBeenCalledWith([
        '/greaseCalculation/parameters',
      ]);
    });

    it('should dispatch undefined bearing', () => {
      component['router'].navigate = jest.fn();

      component.handleBearingSelection(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: undefined })
      );
      expect(component['router'].navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateBack', () => {
    it('should navigate to landing page', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith(['/app']);
    });
  });
});
