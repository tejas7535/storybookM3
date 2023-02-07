import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { Column, ICellRendererParams } from 'ag-grid-community';

import { DataResult, MaterialFormValue } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { deleteEntity, fetchResult } from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  minimizeDialog,
  openDialog,
  openEditDialog,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ActionCellRendererComponent } from './action-cell-renderer.component';

describe('ActionCellRendererComponent', () => {
  let component: ActionCellRendererComponent;
  let spectator: Spectator<ActionCellRendererComponent>;

  let mockDialogRef: MatDialogRef<any>;
  let mockSubjectOpen: Subject<void>;
  let mockSubjectClose: Subject<boolean>;
  let mockSubjectCopyClose: Subject<{
    reload: boolean;
    minimize: { id: number; value: MaterialFormValue };
  }>;

  let mockParams: ICellRendererParams<any, DataResult>;
  const mockData = {} as DataResult;
  const mockColumn = {
    getColId: jest.fn(() => 'column'),
  } as unknown as Column;

  const createComponent = createComponentFactory({
    component: ActionCellRendererComponent,
    imports: [PushModule, MatIconModule],
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
          openConfirmDeleteDialog: jest.fn(() => mockDialogRef),
          openDialog: jest.fn(() => mockDialogRef),
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

      expect(component['dataFacade'].dispatch).not.toBeCalled();
    });

    it('should dispatch call', () => {
      const id = Math.random();
      mockParams.data.id = id;

      component.onDeleteClick();
      mockSubjectClose.next(true);

      expect(component['dataFacade'].dispatch).toBeCalledWith(
        deleteEntity({ id })
      );
    });
  });

  describe('onCopyClick', () => {
    beforeEach(() => {
      mockSubjectCopyClose = new Subject<{
        reload: boolean;
        minimize: { id: number; value: MaterialFormValue };
      }>();
      const afterOpened = () => mockSubjectOpen;
      const afterClosedCopy = () => mockSubjectCopyClose;
      mockDialogRef.afterOpened = afterOpened;
      mockDialogRef.afterClosed = afterClosedCopy;
    });

    it('should dispatch the edit dialog actions and cancel on close', (done) => {
      let otherDone = false;
      component.params = {
        data: mockData,
        column: mockColumn,
      } as ICellRendererParams<any, DataResult>;

      component.onCopyClick();

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        openDialog()
      );

      mockDialogRef.afterOpened().subscribe(() => {
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          openEditDialog({
            row: mockData,
            column: 'column',
          })
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockDialogRef.afterClosed().subscribe((_value) => {
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          materialDialogCanceled()
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockSubjectOpen.next();
      mockSubjectCopyClose.next({ reload: false, minimize: undefined });
    });
    it('should dispatch the edit dialog actions and dispatch fetch and minimize', (done) => {
      let otherDone = false;
      component.params = {
        data: mockData,
        column: mockColumn,
      } as ICellRendererParams<any, DataResult>;

      component.onCopyClick();

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        openDialog()
      );

      mockDialogRef.afterOpened().subscribe(() => {
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          openEditDialog({
            row: mockData,
            column: 'column',
          })
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockDialogRef.afterClosed().subscribe((_value) => {
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          fetchResult()
        );
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          minimizeDialog({ id: 1, value: {} as MaterialFormValue })
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockSubjectOpen.next();
      mockSubjectCopyClose.next({
        reload: true,
        minimize: { id: 1, value: {} as MaterialFormValue },
      });
    });
  });

  describe('onConfirmDelete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should dispatch the deleteEntity action', () => {
      component['onConfirmDelete']();

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        deleteEntity({ id: 876 })
      );
    });
  });
});
