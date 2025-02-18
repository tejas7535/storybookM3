import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { Column, GridApi, RowNode } from 'ag-grid-community';
import { MockPipe } from 'ng-mocks';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { MaterialClass, REFERENCE_DOCUMENT } from '../../../constants';
import { EditCellRendererComponent } from './edit-cell-renderer.component';
import { EditCellRendererParams } from './edit-cell-renderer-params.model';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('EditCellRendererComponent', () => {
  let component: EditCellRendererComponent;
  let spectator: Spectator<EditCellRendererComponent>;
  const materialClass$ = new Subject<MaterialClass>();

  const createComponent = createComponentFactory({
    component: EditCellRendererComponent,
    imports: [MockPipe(PushPipe)],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          materialClass$,
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(),
          openBulkEditDialog: jest.fn(),
          openReferenceDocumentBulkEditDialog: jest.fn(),
        },
      },
    ],
    detectChanges: false,
  });

  const mockData = {} as DataResult;
  const mockColumn = {
    getColId: jest.fn(() => 'column'),
  } as unknown as Column;

  const mockparams = {
    data: mockData,
    column: mockColumn,
    value: 'nix',
    api: {
      getSelectedNodes: jest.fn(() => [] as RowNode[]),
      addEventListener: jest.fn(),
    } as unknown as GridApi,
    node: { isSelected: jest.fn(() => false) },
    hasEditorRole: false,
  } as unknown as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
    spectator.detectChanges();
  });

  describe('agInit', () => {
    it('should initalize variables', () => {
      expect(component.showEdit).toBeFalsy();
    });
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

  describe('allowEdit', () => {
    beforeEach(() => {});
    it('should be set to true for editor and editable classes', () => {
      const params = { ...mockparams, hasEditorRole: true };
      component.agInit(params);
      materialClass$.next(MaterialClass.STEEL);

      expect(component['allowEdit']).toBe(true);
    });

    it('should be set to false for not editable classes', () => {
      const params = { ...mockparams, hasEditorRole: true };
      component.agInit(params);
      materialClass$.next(MaterialClass.POLYMER);

      expect(component['allowEdit']).toBe(false);
    });

    it('should be set to false for non editors', () => {
      const params = { ...mockparams, hasEditorRole: false };
      component.agInit(params);
      materialClass$.next(MaterialClass.STEEL);

      expect(component['allowEdit']).toBe(false);
    });
  });
  describe('showEdit', () => {
    describe('with allowEdit false', () => {
      it('should be set to false on hover', async () => {
        expect(component['allowEdit']).toBe(false);
        component.setHovered(true);
        expect(component.showEdit).toBe(false);
        expect(component.params.node.isSelected).not.toHaveBeenCalled();
        expect(component.params.api.getSelectedNodes).not.toHaveBeenCalled();
      });
      it('should be set to false on hover out', async () => {
        expect(component['allowEdit']).toBe(false);
        component.setHovered(false);
        expect(component.showEdit).toBe(false);
        expect(component.params.node.isSelected).not.toHaveBeenCalled();
        expect(component.params.api.getSelectedNodes).not.toHaveBeenCalled();
      });
    });
    describe('with allowEdit true', () => {
      beforeEach(async () => {
        mockparams.hasEditorRole = true;
        materialClass$.next(MaterialClass.STEEL);
        await new Promise((f) => setTimeout(f, 500));
      });
      it('should be set to true on hover in without selected nodes', async () => {
        expect(component['allowEdit']).toBe(true);
        component.setHovered(true);
        expect(component.showEdit).toBe(true);
        expect(component.params.api.getSelectedNodes).toHaveBeenCalled();
        expect(component.params.node.isSelected).not.toHaveBeenCalled();
      });
      it('should be set to false on hover out without selected nodes', async () => {
        expect(component['allowEdit']).toBe(true);
        component.setHovered(false);
        expect(component.showEdit).toBe(false);
      });

      it('should be set to true on hover in with active node selected', async () => {
        mockparams.api.getSelectedNodes = jest.fn(() => [{} as RowNode]);
        mockparams.node.isSelected = jest.fn(() => true);

        expect(component['allowEdit']).toBe(true);
        component.setHovered(true);
        expect(component.showEdit).toBe(true);
        expect(component.params.api.getSelectedNodes).toHaveBeenCalled();
        expect(component.params.node.isSelected).toHaveBeenCalled();
      });
      it('should be set to false on hover in with other node selected', async () => {
        mockparams.api.getSelectedNodes = jest.fn(() => [{} as RowNode]);
        mockparams.node.isSelected = jest.fn(() => false);

        expect(component['allowEdit']).toBe(true);
        component.setHovered(true);
        expect(component.showEdit).toBe(false);
        expect(component.params.api.getSelectedNodes).toHaveBeenCalled();
        expect(component.params.node.isSelected).toHaveBeenCalled();
      });
    });
  });

  describe('onEditClick', () => {
    it('should call the dialog service', () => {
      component.params.api.getSelectedNodes = () => [];
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
      component.params.api.getSelectedNodes = () => [
        {} as RowNode,
        {} as RowNode,
        {} as RowNode,
      ];
      component.onEditClick();

      expect(
        component['dialogService'].openBulkEditDialog
      ).toHaveBeenCalledWith(
        mockparams.api.getSelectedNodes(),
        mockColumn.getColId()
      );
    });

    it('should call the dialog service for reference documents', () => {
      component.params.column.getColId = () => REFERENCE_DOCUMENT;
      component.params.api.getSelectedNodes = () => [
        { data: { id: 1 } } as RowNode,
        { data: { id: 2 } } as RowNode,
        { data: { id: 3 } } as RowNode,
      ];

      component.onEditClick();

      expect(
        component['dialogService'].openReferenceDocumentBulkEditDialog
      ).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });
});
