import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '../app-route-path.enum';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { selectBearing } from './../core/store/actions/bearing/bearing.actions';
import { getModelCreationSuccess } from './../core/store/selectors/bearing/bearing.selector';
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
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
      SubheaderModule,
      ReactiveComponentModule,
      MatButtonModule,
      MatSnackBarModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [BearingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
    component['router'].navigate = jest.fn();
    component['snackbar'].open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleBearingSelection', () => {
    it('should dispatch select bearing and show snackbar if model creation failed', () => {
      store.overrideSelector(getModelCreationSuccess, false);

      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        translate('bearing.modelCreationError', { bearing: 'some bearing' }),
        translate('bearing.close')
      );
    });
    it('should dispatch select bearing and navigate to parameters', () => {
      store.overrideSelector(getModelCreationSuccess, true);

      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
      ]);
      expect(component['snackbar'].open).not.toHaveBeenCalled();
    });

    it('should dispatch undefined bearing', () => {
      component.handleBearingSelection(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: undefined })
      );
    });
  });

  describe('navigateBack', () => {
    it('should navigate to landing page', () => {
      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.BasePath}`,
      ]);
    });
  });

  describe('toggleSelection', () => {
    it('should invert detailSelection', () => {
      component.detailSelection = false;
      component.toggleSelection();

      expect(component.detailSelection).toBe(true);
    });
  });
});
