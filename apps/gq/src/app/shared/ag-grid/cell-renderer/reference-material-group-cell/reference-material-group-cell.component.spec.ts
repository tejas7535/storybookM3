import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { ReferenceMaterialGroupCellComponent } from './reference-material-group-cell.component';

describe('ReferenceMaterialGroupCellComponent', () => {
  let component: ReferenceMaterialGroupCellComponent;
  let spectator: Spectator<ReferenceMaterialGroupCellComponent>;

  const createComponent = createComponentFactory({
    component: ReferenceMaterialGroupCellComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set properties', () => {
      const params = {
        value: 'test',
        context: {
          componentParent: {
            consoleLog: jest.fn(),
          },
        },
      } as unknown as ICellRendererParams;

      component.agInit(params);

      expect(component.value).toEqual(params.value);
      expect(component.params).toEqual(params);
    });
  });

  describe('clickMaterial', () => {
    test('should call parentComponent.comparableMaterialClicked', () => {
      const params = {
        value: 'test',
        context: {
          componentParent: {
            comparableMaterialClicked: jest.fn(),
          },
        },
      } as unknown as ICellRendererParams;

      component.agInit(params);
      component.clickMaterial(new MouseEvent('click'));

      expect(
        params.context.componentParent.comparableMaterialClicked
      ).toHaveBeenCalledWith(`${params.value}`);
    });
  });
});
