import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AmountCellRendererComponent } from './amount-cell-renderer.component';

describe('AmountCellRendererComponent', () => {
  let component: AmountCellRendererComponent;
  let spectator: Spectator<AmountCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: AmountCellRendererComponent,
    imports: [FlexLayoutModule, MatIconModule],
    declarations: [AmountCellRendererComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set amount', () => {
      const params = ({ value: 100 } as unknown) as ICellRendererParams;

      component.agInit(params);

      expect(component.amount).toEqual(100);
    });
  });
});
