import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  setSelectedProductLines,
  setSelectedSeries,
} from '../../../../core/store';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
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
      ReactiveComponentModule,
    ],
    declarations: [FilterSelectionComponent],
    providers: [provideMockStore({})],
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
});
