import { FormControl } from '@angular/forms';

import { of } from 'rxjs';

import { SystemMessageSettings } from '../../../shared/models/user-settings.model';
import { SystemMessageService } from '../../../shared/services/system-message.service';
import { Stub } from '../../../shared/test/stub.class';
import {
  AlertType,
  BannerSettingsComponent,
} from './banner-settings.component';

describe('BannerSettingsComponent', () => {
  let component: BannerSettingsComponent;
  let systemMessageServiceMock: SystemMessageService;

  const mockSettings: SystemMessageSettings = {
    message: 'Test message',
    headline: 'Test headline',
    active: true,
    closable: true,
    type: AlertType.INFO,
  };

  beforeEach(() => {
    systemMessageServiceMock = {
      get$: jest.fn().mockReturnValue(of(mockSettings)),
      put$: jest.fn().mockReturnValue(of({})),
      loading: false,
    } as unknown as SystemMessageService;

    component = Stub.getForEffect<BannerSettingsComponent>({
      component: BannerSettingsComponent,
      providers: [
        { provide: SystemMessageService, useValue: systemMessageServiceMock },
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load settings on init', () => {
      component.ngOnInit();

      expect(systemMessageServiceMock.get$).toHaveBeenCalled();
      expect(component['form'].value).toEqual({
        message: mockSettings.message,
        headline: mockSettings.headline,
        active: mockSettings.active,
        closable: mockSettings.closable,
        type: mockSettings.type,
      });
      expect(component['form'].pristine).toBeTruthy();
    });
  });

  describe('initialization', () => {
    it('should have required validators', () => {
      const messageControl = component['form'].get('message') as FormControl;
      const typeControl = component['form'].get('type') as FormControl;

      expect(messageControl.validator).toBeTruthy();
      expect(typeControl.validator).toBeTruthy();

      messageControl.setValue(null);
      expect(messageControl.valid).toBeFalsy();

      typeControl.setValue(null);
      expect(typeControl.valid).toBeFalsy();
    });

    it('should have formContent with correct structure', () => {
      expect(component['formContent'].length).toBe(5);
      expect(component['formContent'][0].type).toBe('input');
      expect(component['formContent'][1].type).toBe('textarea');
      expect(component['formContent'][2].type).toBe('select');
      expect(component['formContent'][3].type).toBe('toggle');
      expect(component['formContent'][4].type).toBe('toggle');
    });

    it('should expose loading state from systemMessageService', () => {
      expect(component['loading']).toBe(systemMessageServiceMock.loading);
    });
  });

  describe('onSubmit', () => {
    it('should not submit when form is invalid', () => {
      component['form'].get('message')?.setValue(null);
      component['form'].get('message')?.markAsDirty();
      component['onSubmit']();

      expect(systemMessageServiceMock.put$).not.toHaveBeenCalled();
    });

    it('should submit when form is valid', () => {
      component['form'].patchValue({
        message: 'Updated message',
        headline: 'Updated headline',
        active: false,
        closable: false,
        type: AlertType.WARNING,
      });
      component['form'].markAsDirty();

      component['onSubmit']();

      expect(systemMessageServiceMock.put$).toHaveBeenCalledWith({
        message: 'Updated message',
        headline: 'Updated headline',
        active: false,
        closable: false,
        type: AlertType.WARNING,
      });
    });
  });

  describe('load', () => {
    it('should properly reset form after loading settings', () => {
      component['form'].markAsDirty();
      component['form'].markAsTouched();

      (component as any).load();

      expect(component['form'].pristine).toBeTruthy();
      expect(component['form'].touched).toBeFalsy();
    });

    it('should handle null settings from service', () => {
      const emptySettings = null as any;
      jest
        .spyOn(systemMessageServiceMock, 'get$')
        .mockReturnValue(of(emptySettings));

      (component as any).load();

      expect(component['form'].value).toEqual({
        message: null,
        headline: null,
        active: null,
        closable: null,
        type: AlertType.INFO,
      });
    });

    it('should handle empty settings from service', () => {
      const emptySettings = {} as SystemMessageSettings;
      jest
        .spyOn(systemMessageServiceMock, 'get$')
        .mockReturnValue(of(emptySettings));

      (component as any).load();

      expect(component['form'].value).toEqual({
        message: null,
        headline: null,
        active: null,
        closable: null,
        type: AlertType.INFO,
      });
    });

    it('should default to AlertType.INFO when settings have no type', () => {
      const settingsWithoutType = { ...mockSettings, type: undefined as any };
      jest
        .spyOn(systemMessageServiceMock, 'get$')
        .mockReturnValue(of(settingsWithoutType));

      (component as any).load();

      expect(component['form'].value.type).toBe(AlertType.INFO);
    });

    it('should update form validity after loading settings', () => {
      jest.spyOn(component['form'], 'updateValueAndValidity');

      (component as any).load();

      expect(component['form'].updateValueAndValidity).toHaveBeenCalled();
    });
  });
});
