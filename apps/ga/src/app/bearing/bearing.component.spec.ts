import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { completeStep } from '../core/store/actions/settings/settings.action';
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
      ReactiveFormsModule,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleBearingSelection', () => {
    it('should dispatch select bearing and navigate to parameters', () => {
      component.handleBearingSelection('some bearing');

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
      expect(store.dispatch).toHaveBeenCalledWith(completeStep());
    });

    it('should dispatch undefined bearing', () => {
      component.handleBearingSelection(undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: undefined })
      );
      expect(store.dispatch).not.toHaveBeenCalledWith(completeStep());
    });
  });

  describe('navigateBack', () => {
    it('should navigate to landing page', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith(['app']);
    });
  });
});
