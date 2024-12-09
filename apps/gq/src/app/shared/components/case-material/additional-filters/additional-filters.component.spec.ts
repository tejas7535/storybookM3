import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdditionalFiltersComponent } from './additional-filters.component';
import { FilterSelectionComponent } from './filter-selection/filter-selection.component';

describe('AdditionalFiltersComponent', () => {
  let component: AdditionalFiltersComponent;
  let spectator: Spectator<AdditionalFiltersComponent>;
  const createComponent = createComponentFactory({
    component: AdditionalFiltersComponent,
    imports: [
      provideTranslocoTestingModule({}),
      MatFormFieldModule,
      MatSelectModule,
      ReactiveFormsModule,
      SharedPipesModule,
      LoadingSpinnerModule,
      PushPipe,
    ],
    declarations: [FilterSelectionComponent],
    providers: [
      mockProvider(CreateCaseFacade, {
        getProductLinesAndSeries$: of([]),
        getProductLinesAndSeriesLoading$: of(false),
        selectProductLines: jest.fn(),
        selectSeries: jest.fn(),
        selectGpsdGroups: jest.fn(),
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectProductLines', () => {
    test('should dispatch action', () => {
      const selectedProductLines = ['132'];
      component.selectProductLines(selectedProductLines);
      expect(
        component['createCaseFacade'].selectProductLines
      ).toHaveBeenCalledTimes(1);
      expect(
        component['createCaseFacade'].selectProductLines
      ).toHaveBeenCalledWith(selectedProductLines);
    });
  });
  describe('selectSeries', () => {
    test('should dispatch action', () => {
      const selectedSeries = ['132'];
      component.selectSeries(selectedSeries);
      expect(component['createCaseFacade'].selectSeries).toHaveBeenCalledTimes(
        1
      );
      expect(component['createCaseFacade'].selectSeries).toHaveBeenCalledWith(
        selectedSeries
      );
    });
  });
  describe('selectGpsdGroups', () => {
    test('should dispatch action', () => {
      const selectedGpsdGroups = ['132'];
      component.selectGpsdGroups(selectedGpsdGroups);
      expect(
        component['createCaseFacade'].selectGpsdGroups
      ).toHaveBeenCalledTimes(1);
      expect(
        component['createCaseFacade'].selectGpsdGroups
      ).toHaveBeenCalledWith(selectedGpsdGroups);
    });
  });
});
