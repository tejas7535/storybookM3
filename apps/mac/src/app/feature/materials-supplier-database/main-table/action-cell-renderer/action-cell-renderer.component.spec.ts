import { MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import {
  Column,
  GridApi,
  ICellRendererParams,
  RowNode,
} from 'ag-grid-community';
import { MockPipe } from 'ng-mocks';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ActionCellRendererComponent } from './action-cell-renderer.component';

describe('ActionCellRendererComponent', () => {
  let component: ActionCellRendererComponent;
  let spectator: Spectator<ActionCellRendererComponent>;
  let dataFacade: DataFacade;

  let mockDialogRef: MatDialogRef<any>;
  let mockSubjectOpen: Subject<void>;
  let mockSubjectClose: Subject<boolean>;

  let mockParams: ICellRendererParams<any, DataResult>;
  const mockData = {} as DataResult;
  const mockColumn = {
    getColId: jest.fn(() => 'column'),
  } as unknown as Column;

  const createComponent = createComponentFactory({
    component: ActionCellRendererComponent,
    imports: [MockPipe(PushPipe)],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          deleteEntity: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openConfirmDeleteDialog: jest.fn(() => mockDialogRef),
          openDialog: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    mockSubjectOpen = new Subject<void>();
    mockSubjectClose = new Subject<boolean>();
    mockParams = {
      data: {
        id: 876,
      },
    } as ICellRendererParams<any, DataResult>;
    const afterOpened = () => mockSubjectOpen;
    const afterClosed = () => mockSubjectClose;
    mockDialogRef = {
      afterOpened,
      afterClosed,
    } as unknown as MatDialogRef<any>;
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = mockParams;

    dataFacade = spectator.inject(DataFacade);
  });

  describe('agInit', () => {
    it('should assign params', () => {
      const overRide = {} as ICellRendererParams;

      component.agInit(overRide);

      expect(component.params).toEqual(overRide);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('onDeleteClick', () => {
    // order is important because of observable being "remembered"
    it('should not dispatch call', () => {
      component.onDeleteClick();
      mockSubjectClose.next(false);

      expect(dataFacade.deleteEntity).not.toBeCalled();
    });

    it('should dispatch call', () => {
      const id = Math.random();
      mockParams.data.id = id;

      component.onDeleteClick();
      mockSubjectClose.next(true);

      expect(dataFacade.deleteEntity).toBeCalledWith(id);
    });
  });

  describe('onCopyClick', () => {
    it('should dispatch the edit dialog actions', () => {
      component.params = {
        data: mockData,
        column: mockColumn,
      } as ICellRendererParams<any, DataResult>;

      component.onCopyClick();
      expect(component['dialogService'].openDialog).toBeCalledWith(false, {
        row: mockData,
        column: mockColumn.getColId(),
        isCopy: true,
      });
    });
  });

  describe('onConfirmDelete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should dispatch the deleteEntity action', () => {
      component['onConfirmDelete']();

      expect(dataFacade.deleteEntity).toHaveBeenCalledWith(876);
    });
  });

  describe('isSelected', () => {
    it('should be selected', () => {
      component.params = {
        node: {
          isSelected: jest.fn(() => true),
        } as unknown as RowNode,
      } as unknown as ICellRendererParams<any, DataResult>;
      expect(component.isSelected()).toBeTruthy();
    });
    it('should not be selected', () => {
      component.params = {
        node: {
          isSelected: jest.fn(() => false),
        } as unknown as RowNode,
      } as unknown as ICellRendererParams<any, DataResult>;
      expect(component.isSelected()).toBeFalsy();
    });
  });

  describe('activeSelectionOnGrid', () => {
    it('should be true', () => {
      component.params = {
        api: {
          getSelectedRows: jest.fn(() => [1, 2, 3, 4]),
        } as unknown as GridApi,
      } as unknown as ICellRendererParams<any, DataResult>;
      expect(component.activeSelectionOnGrid()).toBeTruthy();
    });
    it('should be false', () => {
      component.params = {
        api: {
          getSelectedRows: jest.fn(() => []),
        } as unknown as GridApi,
      } as unknown as ICellRendererParams<any, DataResult>;
      expect(component.activeSelectionOnGrid()).toBeFalsy();
    });
  });

  describe('onSelectClick', () => {
    it('should be selected', () => {
      component.params = {
        node: {
          isSelected: jest.fn(() => false),
          setSelected: jest.fn(),
        } as unknown as RowNode,
      } as unknown as ICellRendererParams<any, DataResult>;
      component.onSelectClick();
      expect(component.params.node.setSelected).toBeCalledWith(true);
    });
    it('should be unselected', () => {
      component.params = {
        node: {
          isSelected: jest.fn(() => true),
          setSelected: jest.fn(),
        } as unknown as RowNode,
      } as unknown as ICellRendererParams<any, DataResult>;
      component.onSelectClick();
      expect(component.params.node.setSelected).toBeCalledWith(false);
    });
  });
});
