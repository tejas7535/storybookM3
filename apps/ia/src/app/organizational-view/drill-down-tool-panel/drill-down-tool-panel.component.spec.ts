import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { DrillDownToolPanelComponent } from './drill-down-tool-panel.component';

describe('DrillDownToolPanelComponent', () => {
  let component: DrillDownToolPanelComponent;
  let spectator: Spectator<DrillDownToolPanelComponent>;

  const createComponent = createComponentFactory({
    component: DrillDownToolPanelComponent,
    detectChanges: false,
    imports: [
      MatButtonToggleModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
      MatTooltipModule,
      MatMenuModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChartTypeChange', () => {
    test('should emit value', () => {
      component.chartTypeChanged.emit = jest.fn();
      const event: MatButtonToggleChange = {
        value: 'test',
      } as unknown as MatButtonToggleChange;

      component.onChartTypeChange(event);

      expect(component.chartTypeChanged.emit).toHaveBeenCalledWith(event.value);
    });
  });

  describe('onFluctuationTypeChange', () => {
    test('should emit value', () => {
      component.fluctuationTypeChanged.emit = jest.fn();
      const event: MatButtonToggleChange = {
        value: FluctuationType.REMAINING,
      } as unknown as MatButtonToggleChange;

      component.onFluctuationTypeChange(event);

      expect(component.fluctuationTypeChanged.emit).toHaveBeenCalledWith(
        event.value
      );
    });
  });

  describe('onExportBtnClick', () => {
    test('should emit void', () => {
      component.exportBtn.emit = jest.fn();

      component.onExportBtnClick();

      expect(component.exportBtn.emit).toHaveBeenCalled();
    });
  });

  describe('onExpandBtnClick', () => {
    test('should emit void', () => {
      component.expandBtn.emit = jest.fn();

      component.onExpandBtnClick();

      expect(component.expandBtn.emit).toHaveBeenCalled();
    });
  });

  describe('onCollapseBtnClick', () => {
    test('should emit void', () => {
      component.collapseBtn.emit = jest.fn();

      component.onCollapseBtnClick();

      expect(component.collapseBtn.emit).toHaveBeenCalled();
    });
  });
});
