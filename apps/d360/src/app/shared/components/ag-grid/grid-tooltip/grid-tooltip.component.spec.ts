import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-community';

import { GridTooltipComponent } from './grid-tooltip.component';

describe('GridTooltipComponent', () => {
  let spectator: Spectator<GridTooltipComponent>;

  const createComponent = createComponentFactory({
    component: GridTooltipComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.component.agInit({} as ITooltipParams);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
