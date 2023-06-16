import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { Column } from 'ag-grid-community';

import { DataResult, MaterialFormValue } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { fetchResult } from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  minimizeDialog,
  openDialog,
  openEditDialog,
} from '@mac/msd/store/actions/dialog';
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

  describe('editableClass', () => {
    it('should return true for editable classes', () => {
      const result = component.editableClass(MaterialClass.STEEL);

      expect(result).toBe(true);
    });

    it('should return false for not editable classes', () => {
      const result = component.editableClass(MaterialClass.POLYMER);

      expect(result).toBe(false);
    });
  });

  describe('onEditClick', () => {
    it('should dispatch the edit dialog actions and cancel on close', (done) => {
      let otherDone = false;
      component.params = {
        data: mockData,
        column: mockColumn,
      } as EditCellRendererParams;

      component.onEditClick();

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
      mockSubjectClose.next({ reload: false, minimize: undefined });
    });
    it('should dispatch the edit dialog actions and dispatch fetch and minimize', (done) => {
      let otherDone = false;
      component.params = {
        data: mockData,
        column: mockColumn,
      } as EditCellRendererParams;

      component.onEditClick();

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
      mockSubjectClose.next({
        reload: true,
        minimize: { id: 1, value: {} as MaterialFormValue },
      });
    });
  });
});
