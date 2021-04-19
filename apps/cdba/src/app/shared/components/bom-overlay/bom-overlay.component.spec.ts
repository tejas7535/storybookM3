import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { BomOverlayComponent } from './bom-overlay.component';

describe('BomOverlayComponent', () => {
  let spectator: Spectator<BomOverlayComponent>;
  let component: BomOverlayComponent;

  const createComponent = createComponentFactory({
    component: BomOverlayComponent,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({}),
      MatIconModule,
      MatTabsModule,
      MatRippleModule,
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      component['closeOverlay'].emit = jest.fn();

      component.onClose();

      expect(component['closeOverlay'].emit).toHaveBeenCalled();
    });
  });
});
