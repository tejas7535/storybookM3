import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SapMaterialsUploadStatus } from '../sap-materials-upload-status.enum';
import { SapMaterialsUploadStatusChipComponent } from './sap-materials-upload-status-chip.component';

describe('SapMaterialsUploadStatusChipComponent', () => {
  let component: SapMaterialsUploadStatusChipComponent;
  let spectator: Spectator<SapMaterialsUploadStatusChipComponent>;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadStatusChipComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit on remove', () => {
    component.removed.emit = jest.fn();

    component.remove();

    expect(component.removed.emit).toHaveBeenCalledTimes(1);
  });

  describe('status', () => {
    test('should set config for status IN_PROGRESS', () => {
      component.status = SapMaterialsUploadStatus.IN_PROGRESS;

      expect(component.config).toStrictEqual({
        icon: 'cloud_upload',
        color: '#1C98B5',
        textColor: '#00596E',
        backgroundColor: '#F0F6FA',
      });
    });

    test('should set config for status SUCCEED', () => {
      component.status = SapMaterialsUploadStatus.SUCCEEDED;

      expect(component.config).toStrictEqual({
        icon: 'check_circle_outline',
        color: '#A1C861',
        textColor: '#3C7029',
        backgroundColor: '#F8FBF4',
      });
    });

    test('should set config for status FAILED', () => {
      component.status = SapMaterialsUploadStatus.FAILED;

      expect(component.config).toStrictEqual({
        icon: 'warning_outline',
        color: '#CB0B15',
        textColor: '#A30F0C',
        backgroundColor: '#FCEEE8',
      });
    });
  });
});
