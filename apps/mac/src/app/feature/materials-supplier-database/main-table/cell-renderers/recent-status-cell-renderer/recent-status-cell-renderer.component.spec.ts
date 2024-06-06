import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { getRecentlyChanged } from '@mac/msd/main-table/util';
import { DataFacade } from '@mac/msd/store/facades/data';

import * as en from '../../../../../../assets/i18n/en.json';
import { RecentStatusCellRendererComponent } from './recent-status-cell-renderer.component';

jest.mock('@mac/msd/main-table/util', () => ({
  ...jest.requireActual('@mac/msd/main-table/util'),
  getRecentlyChanged: jest.fn(),
}));

describe('EditCellRendererComponent', () => {
  let component: RecentStatusCellRendererComponent;
  let spectator: Spectator<RecentStatusCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: RecentStatusCellRendererComponent,
    imports: [provideTranslocoTestingModule({ en })],
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('agInit', () => {
    it('should assign the status TRUE', () => {
      const mockParams = {
        data: { blocked: true, lastModified: 1 },
      } as ICellRendererParams;
      (getRecentlyChanged as jest.Mock).mockReturnValue(true);
      component.agInit(mockParams);

      expect(component.isRecent).toBeTruthy();
      expect(getRecentlyChanged).toHaveBeenCalledWith(1);
    });
    it('should assign the status FALSE', () => {
      const mockParams = {
        data: { blocked: false, lastModified: 1 },
      } as ICellRendererParams;
      (getRecentlyChanged as jest.Mock).mockReturnValue(false);
      component.agInit(mockParams);

      expect(component.isRecent).toBeFalsy();
      expect(getRecentlyChanged).toHaveBeenCalledWith(1);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });
});
