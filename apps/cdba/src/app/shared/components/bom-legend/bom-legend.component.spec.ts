import { AgGridModule } from '@ag-grid-community/angular';
import { ColumnUtilsService } from '@cdba/shared/components/table';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { BomLegendComponent } from './bom-legend.component';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

describe('BomLegendComponent', () => {
  let spectator: Spectator<BomLegendComponent>;
  let component: BomLegendComponent;

  const createComponent = createComponentFactory({
    component: BomLegendComponent,
    declarations: [MaterialDesignationCellRendererComponent],
    imports: [
      AgGridModule.withComponents([MaterialDesignationCellRendererComponent]),
    ],
    providers: [
      mockProvider(ColumnUtilsService, {
        formatNumber: jest.fn(() => ''),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
