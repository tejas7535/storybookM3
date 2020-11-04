import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { OrgChartComponent } from './org-chart.component';

describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    imports: [],
    providers: [],
    declarations: [OrgChartComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
