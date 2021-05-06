import { MatCheckboxModule } from '@angular/material/checkbox';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { OverviewChartLegendComponent } from './overview-chart-legend.component';

describe('OverviewChartLegendComponent', () => {
  let component: OverviewChartLegendComponent;
  let spectator: Spectator<OverviewChartLegendComponent>;

  const createComponent = createComponentFactory({
    component: OverviewChartLegendComponent,
    detectChanges: false,
    imports: [SharedModule, MatCheckboxModule, TranslocoTestingModule],
    declarations: [OverviewChartLegendComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeSelected', () => {
    it('should emit toggleSeries event', () => {
      jest.spyOn(component['toggleSeries'], 'emit');

      component.changeSelected('2020');

      expect(component['toggleSeries'].emit).toHaveBeenCalledWith('2020');
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
