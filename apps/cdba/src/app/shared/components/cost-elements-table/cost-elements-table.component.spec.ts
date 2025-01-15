import { SimpleChange } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi, GridReadyEvent } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CostComponentSplit } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import * as sharedEnJson from '../../../../assets/i18n/en.json';
import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { CostElementsStatusBarModule } from '../table/status-bar/cost-elements-status-bar';
import { ColumnDefinitionService } from './config';
import { CostElementsTableComponent } from './cost-elements-table.component';

describe('CostElementsTableComponent', () => {
  let component: CostElementsTableComponent;
  let spectator: Spectator<CostElementsTableComponent>;

  const createComponent = createComponentFactory({
    component: CostElementsTableComponent,
    imports: [
      MatIconModule,
      MockModule(AgGridModule),
      MockModule(CustomOverlayModule),
      MockModule(CostElementsStatusBarModule),
      provideTranslocoTestingModule({ en: sharedEnJson }),
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
    let mockedCostComponentSplit: CostComponentSplit;
    beforeEach(() => {
      component['gridApi'] = {
        setGridOption: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown as GridApi;
    });

    it('should show loading overlay if grid loaded and isLoading active', () => {
      jest.spyOn(window, 'setTimeout');

      component.ngOnChanges({
        isLoading: {
          currentValue: true,
        } as unknown as SimpleChange,
      });

      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
        costElementsData: { currentValue: [] } as unknown as SimpleChange,
      });

      expect(component['gridApi'].setGridOption).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('No data to display');
    });

    it('should hide loading spinner and show data when loading is done', () => {
      mockedCostComponentSplit = {
        description: 'description',
        costComponent: 'costComponent',
        splitType: 'MAIN',
        totalValue: 0,
        fixedValue: 0,
        variableValue: 0,
        currency: 'EUR',
      } as CostComponentSplit;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
        costElementsData: {
          currentValue: [mockedCostComponentSplit],
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].setGridOption).toHaveBeenCalledTimes(1);
      expect(component['gridApi'].setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
      expect(component.errorMessage).toEqual('');
    });
  });

  describe('onGridReady', () => {
    it('should set api', () => {
      const params: GridReadyEvent = {
        api: {
          setGridOption: jest.fn(),
        } as unknown as GridApi,
        context: {},
      } as GridReadyEvent;
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });
});
