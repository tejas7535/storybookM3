import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { PcmCellRendererComponent } from './pcm-cell-renderer.component';

describe('PcmCellRendererComponent', () => {
  let component: PcmCellRendererComponent;
  let spectator: Spectator<PcmCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: PcmCellRendererComponent,
    imports: [MatChipsModule, MatTooltipModule, TranslocoTestingModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [PcmCellRendererComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set isPcmRow flag', () => {
      const params = { value: true } as unknown as ICellRendererParams;

      component.agInit(params);

      expect(component.isPcmRow).toBeTruthy();
    });
  });
});
