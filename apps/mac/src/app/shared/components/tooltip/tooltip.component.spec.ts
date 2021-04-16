import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let spectator: Spectator<TooltipComponent>;
  let component: TooltipComponent;

  const createComponent = createComponentFactory({
    component: TooltipComponent,
    declarations: [TooltipComponent],
    imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
