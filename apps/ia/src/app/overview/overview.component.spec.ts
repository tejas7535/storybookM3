import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { OverviewChartModule } from './overview-chart/overview-chart.module';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    detectChanges: false,
    imports: [
      ReactiveComponentModule,
      TranslocoTestingModule,
      OverviewChartModule,
    ],
    providers: [provideMockStore({})],
    declarations: [OverviewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observables', () => {
      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();
      expect(component.attritionData$).toBeDefined();
      expect(component.events$).toBeDefined();
      expect(component.attritionQuotaloading$).toBeDefined();
    });
  });
});
