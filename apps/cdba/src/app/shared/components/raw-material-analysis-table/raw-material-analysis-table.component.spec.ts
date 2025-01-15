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

import { RawMaterialAnalysis } from '@cdba/shared/models/raw-material-analysis.model';
import { UnitOfMeasure } from '@cdba/shared/models/unit-of-measure.model';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import * as sharedEnJson from '../../../../assets/i18n/en.json';
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
    let mockedRawMaterialAnalysis: RawMaterialAnalysis;
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
        rawMaterialAnalysisData: {
          currentValue: [],
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].setGridOption).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('No data to display');
    });

    it('should hide loading spinner and show data when loading is done', () => {
      mockedRawMaterialAnalysis = {
        materialDesignation: 'materialDesignation',
        materialNumber: 'materialNumber',
        costShare: 0,
        supplier: 'supplier',
        operatingUnit: 0,
        unitOfMeasure: UnitOfMeasure.KG,
        uomBaseToPriceFactor: 1,
        price: 1,
        totalCosts: 1,
        totalPrice: 1,
        currency: 'EUR',
      } as RawMaterialAnalysis;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
        rawMaterialAnalysisData: {
          currentValue: [mockedRawMaterialAnalysis],
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].setGridOption).toHaveBeenCalledTimes(1);
      expect(component['gridApi'].setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
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
