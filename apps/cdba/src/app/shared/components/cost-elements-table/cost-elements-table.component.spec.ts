import { SimpleChange } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnApi,
  GridApi,
  GridReadyEvent,
} from '@ag-grid-enterprise/all-modules';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { CostElementsStatusBarModule } from '../table/status-bar/cost-elements-status-bar/cost-elements-status-bar.module';
import { ColumnDefinitionService } from './config';
import { CostElementsTableComponent } from './cost-elements-table.component';

describe('CostElementsTableComponent', () => {
  let component: CostElementsTableComponent;
  let spectator: Spectator<CostElementsTableComponent>;

  const createComponent = createComponentFactory({
    component: CostElementsTableComponent,
    imports: [
      MatIconModule,
      MockModule(AgGridModule.withComponents([])),
      MockModule(CustomOverlayModule),
      MockModule(CostElementsStatusBarModule),
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
    expect(component).toBeTruthy();
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
