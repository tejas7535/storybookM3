import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../assets/i18n/en.json';
import { TailwindColor } from '../../models/taliwind-color.enum';
import { ChartLegendItem } from '../models/chart-legend-item.model';
import { ChartLegendComponent } from './chart-legend.component';

describe('ChartLegendComponent', () => {
  let component: ChartLegendComponent;
  let spectator: Spectator<ChartLegendComponent>;
  const items = [
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.danger.title',
      TailwindColor.PRIMARY,
      'organizationalView.worldMap.chartLegend.danger.tooltip'
    ),
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.warning.title',
      TailwindColor.ERROR,
      'organizationalView.worldMap.chartLegend.warning.tooltip'
    ),
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.ok.title',
      TailwindColor.WARNING,
      'organizationalView.worldMap.chartLegend.ok.tooltip'
    ),
  ];

  const createComponent = createComponentFactory({
    component: ChartLegendComponent,
    imports: [MatTooltipModule, provideTranslocoTestingModule({ en })],
    declarations: [ChartLegendComponent],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create 3 chart legend items with provided texts', () => {
    component.items = items;
    spectator.detectChanges();

    const native = spectator.debugElement;
    const indicators = native.queryAll(By.css('.chart-legend-item'));

    // FIX: titles should be translated
    expect(indicators.length).toBe(3);
    expect(indicators[0].nativeElement.textContent).toBe(
      'organizationalView.worldMap.chartLegend.danger.title'
    );
    expect(indicators[1].nativeElement.textContent).toBe(
      'organizationalView.worldMap.chartLegend.warning.title'
    );
    expect(indicators[2].nativeElement.textContent).toBe(
      'organizationalView.worldMap.chartLegend.ok.title'
    );
  });

  it('should create 3 chart legend items with provided colors', () => {
    component.items = items;
    spectator.detectChanges();

    const native = spectator.debugElement;
    const indicators = native.queryAll(By.css('.chart-legend-indicator'));

    expect(indicators.length).toBe(3);

    expect(indicators[0].nativeElement.className).toContain('bg-primary');
    expect(indicators[1].nativeElement.className).toContain('bg-error');
    expect(indicators[2].nativeElement.className).toContain('bg-warning');
  });
});
