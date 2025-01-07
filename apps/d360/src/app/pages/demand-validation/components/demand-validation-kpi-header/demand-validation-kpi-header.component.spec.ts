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
    spectator = createComponent();

    spectator.component['params'] = {
      disableClick: false,
      onClickHeader: jest.fn(),
      kpiEntry: {
        fromDate: '2024-12-12',
        bucketType: 'WEEK',
      },
    } as unknown as ICustomHeaderParams;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
