import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-enterprise';

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

  describe('agInit', () => {
    it('sets correct data', () => {
      spectator.component.agInit({
        wide: true,
        lineBreaks: true,
        textLeft: true,
        location: 'UNKNOWN',
        value: '123',
      } as any);

      expect(spectator.component.params).toEqual({
        wide: true,
        lineBreaks: true,
        textLeft: true,
        location: 'UNKNOWN',
        value: '123',
      });
    });
  });
});
