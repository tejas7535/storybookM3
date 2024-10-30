import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  DemandValidationKpiHeaderComponent,
  ICustomHeaderParams,
} from './demand-validation-kpi-header.component';

describe('DemandValidationKpiHeaderComponent', () => {
  let spectator: Spectator<DemandValidationKpiHeaderComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationKpiHeaderComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        params: { displayName: '', kpiEntry: {} } as ICustomHeaderParams,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
