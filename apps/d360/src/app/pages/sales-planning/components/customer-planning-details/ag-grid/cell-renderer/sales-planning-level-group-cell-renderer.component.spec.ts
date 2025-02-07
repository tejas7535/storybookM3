import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SalesPlanningLevelGroupCellRendererComponent } from './sales-planning-level-group-cell-renderer.component';

describe('SalesPlanningLevelGroupCellRendererComponent', () => {
  let spectator: Spectator<SalesPlanningLevelGroupCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: SalesPlanningLevelGroupCellRendererComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should render planning material and text if node level is 1 and required keys exist', () => {
    const params: ICellRendererParams = {
      node: { level: 1 },
      data: {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
      },
    } as any;

    spectator.component.agInit(params);
    spectator.detectChanges();

    expect(spectator.element).toHaveText('I03 - Bearings');
  });

  it('should render planning year if node level is not 1 or required keys do not exist', () => {
    const params: ICellRendererParams = {
      node: { level: 2 },
      data: {
        planningYear: '2025',
      },
    } as any;

    spectator.component.agInit(params);
    spectator.detectChanges();

    expect(spectator.element).toHaveText('2025');
  });

  it('should render planning year if required keys are missing', () => {
    const params: ICellRendererParams = {
      node: { level: 1 },
      data: {
        planningYear: '2026',
      },
    } as any;

    spectator.component.agInit(params);
    spectator.detectChanges();

    expect(spectator.element).toHaveText('2026');
  });
});
