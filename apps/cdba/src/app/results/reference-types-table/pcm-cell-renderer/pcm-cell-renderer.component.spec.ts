import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { PcmBadgeModule } from '@cdba/shared/components/pcm-badge';

import { PcmCellRendererComponent } from './pcm-cell-renderer.component';

describe('PcmCellRendererComponent', () => {
  let component: PcmCellRendererComponent;
  let spectator: Spectator<PcmCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: PcmCellRendererComponent,
    imports: [MockModule(PcmBadgeModule)],
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
