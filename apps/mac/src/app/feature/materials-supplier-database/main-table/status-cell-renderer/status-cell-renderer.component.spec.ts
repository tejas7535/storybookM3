import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LetModule, PushModule } from '@ngrx/component';
import { ICellRendererParams } from 'ag-grid-community';

import { MaterialClass, NavigationLevel, Status } from '@mac/msd/constants';
import { getStatus } from '@mac/msd/main-table/util';
import { DataFacade } from '@mac/msd/store/facades/data';

import { StatusCellRendererComponent } from './status-cell-renderer.component';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';

jest.mock('@mac/msd/main-table/util', () => ({
  ...jest.requireActual('@mac/msd/main-table/util'),
  getStatus: jest.fn(),
}));

describe('EditCellRendererComponent', () => {
  let component: StatusCellRendererComponent;
  let spectator: Spectator<StatusCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: StatusCellRendererComponent,
    imports: [PushModule, provideTranslocoTestingModule({ en }), LetModule],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          navigation$: of({
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
          }),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('agInit', () => {
    it('should assign the status', () => {
      const mockParams = {
        data: { blocked: true, lastModified: 1 },
      } as ICellRendererParams;
      (getStatus as jest.Mock).mockReturnValue(Status.BLOCKED);

      expect(component.status).toEqual(Status.DEFAULT);

      component.agInit(mockParams);

      expect(component.status).toEqual(Status.BLOCKED);
      expect(getStatus).toHaveBeenCalledWith(true, 1);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });
});
