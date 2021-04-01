import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { PcmCellRendererComponent } from './pcm-cell-renderer.component';

describe('PcmCellRendererComponent', () => {
  let component: PcmCellRendererComponent;
  let spectator: Spectator<PcmCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: PcmCellRendererComponent,
    imports: [
      MatChipsModule,
      MatTooltipModule,
      FlexLayoutModule,
      TranslocoTestingModule,
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
      const params = ({ value: true } as unknown) as ICellRendererParams;

      component.agInit(params);

      expect(component.isPcmRow).toBeTruthy();
    });
  });
});
