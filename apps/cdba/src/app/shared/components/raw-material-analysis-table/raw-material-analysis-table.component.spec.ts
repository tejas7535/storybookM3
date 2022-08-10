import { SimpleChange } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { ColumnDefinitionService } from './config';
import { RawMaterialAnalysisTableComponent } from './raw-material-analysis-table.component';

describe('RawMaterialAnalysisTableComponent', () => {
  let spectator: Spectator<RawMaterialAnalysisTableComponent>;
  let component: RawMaterialAnalysisTableComponent;
  const createComponent = createComponentFactory({
    component: RawMaterialAnalysisTableComponent,
    imports: [
      MatIconModule,
      MockModule(AgGridModule),
      MockModule(CustomOverlayModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(ColumnDefinitionService, {
        getColDef: jest.fn(() => ''),
      }),
      mockProvider(BetaFeatureService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });

  describe('noRowsOverlayComponentParams', () => {
    it('should return errorMessage on getMessage', () => {
      component.errorMessage = 'test';
      const result = component.noRowsOverlayComponentParams.getMessage();

      expect(result).toEqual(component.errorMessage);
    });
  });

  describe('ngOnChanges', () => {
    it('should showLoadingOverlay if grid loaded and isLoading active', () => {
      jest.spyOn(window, 'setTimeout');
      component['gridApi'] = {
        showLoadingOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: true,
        } as unknown as SimpleChange,
      });

      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component['gridApi'] = {
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    it('should set api', () => {
      const params: GridReadyEvent = {
        api: {
          showLoadingOverlay: jest.fn(),
        } as unknown as GridApi,
        columnApi: {} as unknown as ColumnApi,
        type: '',
      };
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });
});
