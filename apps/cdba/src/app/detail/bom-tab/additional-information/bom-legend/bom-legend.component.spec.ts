import { FlexLayoutModule } from '@angular/flex-layout';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BomLegendComponent } from './bom-legend.component';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

describe('BomLegendComponent', () => {
  let spectator: Spectator<BomLegendComponent>;
  let component: BomLegendComponent;

  const createComponent = createComponentFactory({
    component: BomLegendComponent,
    declarations: [MaterialDesignationCellRendererComponent],
    imports: [
      FlexLayoutModule,
      AgGridModule.withComponents([MaterialDesignationCellRendererComponent]),
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
