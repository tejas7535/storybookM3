import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { RawMaterialAnalysisTableComponent } from './raw-material-analysis-table.component';

describe('RawMaterialAnalysisTableComponent', () => {
  let spectator: Spectator<RawMaterialAnalysisTableComponent>;
  const createComponent = createComponentFactory(
    RawMaterialAnalysisTableComponent
  );

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
