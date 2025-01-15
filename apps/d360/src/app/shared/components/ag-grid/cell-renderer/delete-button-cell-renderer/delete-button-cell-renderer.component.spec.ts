import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { DeleteButtonCellRendererComponent } from './delete-button-cell-renderer.component';

describe('DeleteButtonCellRendererComponent', () => {
  let spectator: Spectator<DeleteButtonCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: DeleteButtonCellRendererComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.component.agInit({} as ICellRendererParams);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
