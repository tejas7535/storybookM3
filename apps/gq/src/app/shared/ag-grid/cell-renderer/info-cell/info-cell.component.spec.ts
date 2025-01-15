import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SAP_ERROR_MESSAGE_CODE } from '@gq/shared/models/quotation-detail';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { CellClassParams } from 'ag-grid-enterprise';

import { ValidationDescription } from '../../../models/table';
import { ColumnUtilityService } from '../../services';
import { InfoCellComponent } from './info-cell.component';

describe('InfoCellComponent', () => {
  let component: InfoCellComponent;
  let spectator: Spectator<InfoCellComponent>;

  const createComponent = createComponentFactory({
    component: InfoCellComponent,
    declarations: [InfoCellComponent],
    imports: [MatIconModule, MatTooltipModule],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ColumnUtilityService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.isErrorText = undefined;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    const cellClassParams = {
      value: { valid: true },
      data: {
        info: {
          description: [ValidationDescription.Valid],
        },
      },
    } as CellClassParams;
    test('should set valid', () => {
      component.agInit(cellClassParams);

      expect(component.valid).toBeTruthy();
    });
    test('should set invalid', () => {
      const params: CellClassParams = cellClassParams;
      params.data.info.description = [ValidationDescription.QuantityInValid];
      params.value.valid = false;
      component.agInit(cellClassParams);

      expect(component.valid).toBeFalsy();
    });
    test('should set isLoading, if not validated yet', () => {
      const params: CellClassParams = cellClassParams;
      params.data.info.description = [ValidationDescription.Not_Validated];
      params.value.valid = false;

      component.agInit(params);

      expect(component.isLoading).toBeTruthy();
      expect(component.valid).toBeFalsy();
    });

    test('should set isErrorText to false', () => {
      const params: CellClassParams = cellClassParams;
      params.data.info.description = [ValidationDescription.Not_Validated];
      params.value.valid = false;

      component.agInit(params);
      expect(component.isErrorText).toBe(false);
    });
    test('should set isErrorText to true', () => {
      const params: CellClassParams = cellClassParams;
      params.data.info.description = [ValidationDescription.Not_Validated];
      params.data.info.codes = [SAP_ERROR_MESSAGE_CODE.SDG1000];
      params.value.valid = false;

      component.agInit(params);
      expect(component.isErrorText).toBe(true);
    });
  });
});
