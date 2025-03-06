import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let spectator: Spectator<TooltipComponent>;
  let component: TooltipComponent;

  const createComponent = createComponentFactory({
    component: TooltipComponent,
    imports: [MatButtonModule, MatTooltipModule, MatIconModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
