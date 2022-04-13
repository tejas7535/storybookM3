import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CellClassParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { ValidationDescription } from '../../../models/table';
import { InfoCellComponent } from './info-cell.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InfoCellComponent', () => {
  let component: InfoCellComponent;
  let spectator: Spectator<InfoCellComponent>;

  const createComponent = createComponentFactory({
    component: InfoCellComponent,
    declarations: [InfoCellComponent],
    imports: [MatIconModule, MatTooltipModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
  });
});
