import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PmgmData } from '../../models';
import { PmgmPositionComponent } from './pmgm-position.component';

describe('PmgmPositionComponent', () => {
  let component: PmgmPositionComponent;
  let spectator: Spectator<PmgmPositionComponent>;

  const createComponent = createComponentFactory({
    component: PmgmPositionComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [PmgmPositionComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set isManager to true', () => {
      component.agInit({
        data: { isManager: true } as unknown as PmgmData,
      } as ICellRendererParams);
      expect(component.isManager).toBeTruthy();
    });

    test('should set isManager to false', () => {
      component.agInit({ data: { manager: false } } as ICellRendererParams);
      expect(component.isManager).toBeFalsy();
    });
  });

  test('refresh should return false', () => {
    expect(component.refresh()).toBeFalsy();
  });
});
