import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { Column, RowNode } from 'ag-grid-community';

import { DataResult, MaterialFormValue } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { MaterialClass } from '../../constants';
import { EditCellRendererComponent } from './edit-cell-renderer.component';
import { EditCellRendererParams } from './edit-cell-renderer-params.model';

describe('EditCellRendererComponent', () => {
  let component: EditCellRendererComponent;
  let spectator: Spectator<EditCellRendererComponent>;

  let afterOpened: () => Subject<void>;
  let afterClosed: () => Subject<{
    reload: boolean;
    minimize: { id: number; value: MaterialFormValue };
  }>;
  let mockDialogRef: MatDialogRef<any>;

  let mockSubjectOpen: Subject<void>;
  let mockSubjectClose: Subject<{
    reload: boolean;
    minimize: { id: number; value: MaterialFormValue };
  }>;

  const setSelectNodes = () => {
    mockparams.api.getSelectedNodes = () => [
      {} as RowNode,
      {} as RowNode,
      {} as RowNode,
    ];
  };
  const resetSelectNodes = () => {
    mockparams.api.getSelectedNodes = () => [];
  };

  const createComponent = createComponentFactory({
    component: EditCellRendererComponent,
    imports: [PushModule],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          dispatch: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(() => mockDialogRef),
          openBulkEditDialog: jest.fn(),
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
    api: { getSelectedNodes: () => [] },
    node: { isSelected: () => false },
  } as EditCellRendererParams;

  beforeEach(() => {
    mockSubjectOpen = new Subject<void>();
    mockSubjectClose = new Subject<{
      reload: boolean;
      minimize: { id: number; value: MaterialFormValue };
    }>();
    afterOpened = () => mockSubjectOpen;
    afterClosed = () => mockSubjectClose;
    mockDialogRef = {
      afterOpened,
      afterClosed,
    } as unknown as MatDialogRef<any>;
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

  describe('isEnabled', () => {
    beforeEach(() => {
      component['params'].hasEditorRole = true;
      component['params'].node.isSelected = () => false;
      resetSelectNodes();
    });
    it('should return true for editable classes', () => {
      const result = component.isEnabled(MaterialClass.STEEL);

      expect(result).toBe(true);
    });

    it('should return false for not editable classes', () => {
      const result = component.isEnabled(MaterialClass.POLYMER);

      expect(result).toBe(false);
    });

    it('should return false for non editors', () => {
      component['params'].hasEditorRole = false;

      const result = component.isEnabled(MaterialClass.STEEL);

      expect(result).toBe(false);
    });

    it('should return false if other rows are selected', () => {
      setSelectNodes();
      const result = component.isEnabled(MaterialClass.STEEL);

      expect(result).toBe(false);
    });
    it('should return true if this rows is selected', () => {
      setSelectNodes();
      component['params'].node.isSelected = () => true;
      const result = component.isEnabled(MaterialClass.STEEL);

      expect(result).toBe(true);
    });
  });

  describe('onEditClick', () => {
    beforeEach(() => {
      resetSelectNodes();
    });
    it('should call the dialog service', () => {
      component.onEditClick();

      expect(component['dialogService'].openDialog).toHaveBeenCalledWith(
        false,
        {
          row: mockData,
          column: mockColumn.getColId(),
        }
      );
    });

    it('should call the dialog service for bulk edit', () => {
      setSelectNodes();

      component.onEditClick();

      expect(
        component['dialogService'].openBulkEditDialog
      ).toHaveBeenCalledWith(
        mockparams.api.getSelectedNodes(),
        mockColumn.getColId()
      );
    });
  });
});
