import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-community';

import { TextTooltipComponent } from './text-tooltip.component';

describe('TextTooltipComponent', () => {
  let spectator: Spectator<TextTooltipComponent>;
  const createComponent = createComponentFactory({
    component: TextTooltipComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.component.agInit({} as ITooltipParams);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
