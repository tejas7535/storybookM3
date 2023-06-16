import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { TimeoutWarningRendererComponent } from './timeout-warning-cellrenderer-component';

describe('TimeoutWarningRendererComponent', () => {
  let component: TimeoutWarningRendererComponent;
  let spectator: Spectator<TimeoutWarningRendererComponent>;

  const createComponent = createComponentFactory({
    component: TimeoutWarningRendererComponent,
    imports: [MatIconModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [TimeoutWarningRendererComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set show warning flag', () => {
      component.agInit({ value: true });

      expect(component.showWarning).toBeTruthy();
    });
  });
});
