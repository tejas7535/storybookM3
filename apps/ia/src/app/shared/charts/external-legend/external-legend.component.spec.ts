import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { LegendSelectAction } from '../models';
import { ChartLegendItem } from '../models/chart-legend-item.model';
import { ExternalLegendComponent } from './external-legend.component';

describe('ExternalLegendComponent', () => {
  let component: ExternalLegendComponent;
  let spectator: Spectator<ExternalLegendComponent>;

  const createComponent = createComponentFactory({
    component: ExternalLegendComponent,
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLegendItemClicked', () => {
    test('should marked legend item selected as true and trigger selection event when item selected', () => {
      component.selectedLegendItem.emit = jest.fn();
      const bundesligaName = 'Bundesliga';
      component.legend = [
        new ChartLegendItem('Serie A', 'red', undefined, false),
        new ChartLegendItem(bundesligaName, 'blue', undefined, false),
        new ChartLegendItem('Premier League', 'green', undefined, false),
      ];
      const expectedAction = { [bundesligaName]: true } as LegendSelectAction;

      component.onLegendItemClicked(bundesligaName);

      expect(component.selectedLegendItem.emit).toHaveBeenCalledWith(
        expectedAction
      );
      expect(component.legend[1].selected).toBeTruthy();
    });

    test('should marked legend item selected as true and trigger selection event when item unselected', () => {
      component.selectedLegendItem.emit = jest.fn();
      const premierLeagueName = 'Premier League';
      component.legend = [
        new ChartLegendItem('Serie A', 'red', undefined, false),
        new ChartLegendItem(premierLeagueName, 'blue', undefined, true),
        new ChartLegendItem('Premier League', 'green', undefined, false),
      ];
      const expectedAction = {
        [premierLeagueName]: false,
      } as LegendSelectAction;

      component.onLegendItemClicked(premierLeagueName);

      expect(component.selectedLegendItem.emit).toHaveBeenCalledWith(
        expectedAction
      );
      expect(component.legend[2].selected).toBeFalsy();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const testNumber = 5;

      const result = component.trackByFn(testNumber);

      expect(result).toEqual(testNumber);
    });
  });
});
