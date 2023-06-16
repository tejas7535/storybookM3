import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
} from '@gq/core/store/actions';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdditionalFiltersComponent } from './additional-filters.component';
import { FilterSelectionComponent } from './filter-selection/filter-selection.component';

describe('AdditionalFiltersComponent', () => {
  let component: AdditionalFiltersComponent;
  let spectator: Spectator<AdditionalFiltersComponent>;
  let store: MockStore;
  const createComponent = createComponentFactory({
    component: AdditionalFiltersComponent,
    imports: [
      provideTranslocoTestingModule({}),
      MatFormFieldModule,
      MatSelectModule,
      ReactiveFormsModule,
      SharedPipesModule,
      LoadingSpinnerModule,
      PushModule,
    ],
    declarations: [FilterSelectionComponent],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectProductLines', () => {
    test('should dispatch action', () => {
      store.dispatch = jest.fn();
      const selectedProductLines = ['132'];
      component.selectProductLines(selectedProductLines);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedProductLines({ selectedProductLines })
      );
    });
  });
  describe('selectSeries', () => {
    test('should dispatch action', () => {
      store.dispatch = jest.fn();
      const selectedSeries = ['132'];
      component.selectSeries(selectedSeries);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedSeries({ selectedSeries })
      );
    });
  });
  describe('selectGpsdGroups', () => {
    test('should dispatch action', () => {
      store.dispatch = jest.fn();
      const selectedGpsdGroups = ['132'];
      component.selectGpsdGroups(selectedGpsdGroups);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedGpsdGroups({ selectedGpsdGroups })
      );
    });
  });
});
