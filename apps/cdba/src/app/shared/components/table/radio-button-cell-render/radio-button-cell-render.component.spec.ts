import { MatRadioModule } from '@angular/material/radio';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { MockModule } from 'ng-mocks';

import { RadioButtonCellRenderComponent } from './radio-button-cell-render.component';

describe('RadioButtonCellRenderComponent', () => {
  let spectator: Spectator<RadioButtonCellRenderComponent>;
  let component: RadioButtonCellRenderComponent;

  const createComponent = createComponentFactory({
    component: RadioButtonCellRenderComponent,
    imports: [MockModule(MatRadioModule)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set nodes from params', () => {
      component.node = undefined;

      component.agInit({ node: 'test' } as unknown as ICellRendererParams);

      expect(component.node).toBe('test');
    });
  });
});
