import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { ICellRendererParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { deleteEntity } from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ActionCellRendererComponent } from './action-cell-renderer.component';

describe('ActionCellRendererComponent', () => {
  let component: ActionCellRendererComponent;
  let spectator: Spectator<ActionCellRendererComponent>;

  let mockDialogRef: MatDialogRef<any>;
  let mockSubjectClose: Subject<boolean>;
  const mockParams = {
    data: {
      id: 876,
    },
  } as ICellRendererParams<any, DataResult>;

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
        },
      },
    ],
  });

  beforeEach(() => {
    mockSubjectClose = new Subject<boolean>();
    const afterClosed = () => mockSubjectClose;
    mockDialogRef = {
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
});
