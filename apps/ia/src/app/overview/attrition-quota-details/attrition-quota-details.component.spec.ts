import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '../../shared/shared.module';
import { AttritionQuotaDetailsComponent } from './attrition-quota-details.component';
import { OverviewChartModule } from './overview-chart/overview-chart.module';

describe('AttritionQuotaDetailsComponent', () => {
  let component: AttritionQuotaDetailsComponent;
  let spectator: Spectator<AttritionQuotaDetailsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionQuotaDetailsComponent,
    detectChanges: false,
    imports: [SharedModule, ReactiveComponentModule, OverviewChartModule],
    providers: [provideMockStore({})],
    declarations: [AttritionQuotaDetailsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define Observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.attritionData$).toBeDefined();
      expect(component.events$).toBeDefined();
      expect(component.loading$).toBeDefined();
    });
  });
});
