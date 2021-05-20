import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { DoughnutChartModule } from './doughnut-chart/doughnut-chart.module';
import { EntriesExitsComponent } from './entries-exits.component';

describe('EntriesExitsComponent', () => {
  let component: EntriesExitsComponent;
  let spectator: Spectator<EntriesExitsComponent>;

  const createComponent = createComponentFactory({
    component: EntriesExitsComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      DoughnutChartModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set doughnut configs', () => {
      component.ngOnInit();

      expect(component.entriesDoughnutConfig).toBeDefined();
      expect(component.exitsDoughnutConfig).toBeDefined();
    });
  });
});
