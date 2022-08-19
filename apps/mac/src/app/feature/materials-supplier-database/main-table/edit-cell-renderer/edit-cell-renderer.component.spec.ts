import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Column } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';
import { DialogFacade, openEditDialog } from '@mac/msd/store';

import { EditCellRendererComponent } from './edit-cell-renderer.component';
import { EditCellRendererParams } from './edit-cell-renderer-params.model';

describe('EditCellRendererComponent', () => {
  let component: EditCellRendererComponent;
  let spectator: Spectator<EditCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: EditCellRendererComponent,
    providers: [
      {
        provide: DialogFacade,
        useValue: {
          dispatch: jest.fn(),
        },
      },
    ],
  });

  const mockData = {} as DataResult;
  const mockColumn = {
    getColId: jest.fn(() => 'column'),
  } as unknown as Column;

  const mockparams = {
    data: mockData,
    column: mockColumn,
    value: 'nix',
  } as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = mockparams;
  });

  describe('agInit', () => {
    it('should assign params', () => {
      const mockParams = {} as EditCellRendererParams;

      component.agInit(mockParams);

      expect(component.params).toEqual(mockParams);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('setHovered', () => {
    it('should assign hovered', () => {
      component.setHovered(true);

      expect(component.hovered).toBe(true);
    });
  });

  describe('onEditClick', () => {
    it('should dispatch the edit dialog action', () => {
      const mockData = {} as DataResult;
      const mockColumn = {
        getColId: jest.fn(() => 'column'),
      } as unknown as Column;

      component.params = {
        data: mockData,
        column: mockColumn,
      } as EditCellRendererParams;

      component.onEditClick();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        openEditDialog({ material: mockData, column: 'column' })
      );
    });
  });
});
