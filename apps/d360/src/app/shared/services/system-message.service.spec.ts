import { signal } from '@angular/core';

import { of, throwError } from 'rxjs';

import { AlertType } from '../../pages/admin/banner-settings/banner-settings.component';
import { Stub } from '../test/stub.class';
import { SystemMessageService } from './system-message.service';

describe('SystemMessageService', () => {
  let service: SystemMessageService;

  beforeEach(() => {
    service = Stub.get<SystemMessageService>({
      component: SystemMessageService,
      providers: [Stub.getStoreProvider()],
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('authorizedToChange', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(service as any, 'backendRoles').mockReturnValue(null);

      expect(service['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(service as any, 'backendRoles').mockReturnValue([]);

      expect(service['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles does not include any allowed roles', () => {
      jest.spyOn(service as any, 'backendRoles').mockReturnValue(['user']);

      expect(service['authorizedToChange']()).toBe(false);
    });

    it('should return true if backendRoles includes at least one allowed role', () => {
      jest
        .spyOn(service as any, 'backendRoles')
        .mockReturnValue(['SD-D360_ADMIN']);

      expect(service['authorizedToChange']()).toBe(true);
    });

    it('should return true if backendRoles includes multiple allowed roles', () => {
      jest
        .spyOn(service as any, 'backendRoles')
        .mockReturnValue(['admin', 'SD-D360_ADMIN']);

      expect(service['authorizedToChange']()).toBe(true);
    });

    it('should return false if backendRoles includes roles but none are allowed', () => {
      jest
        .spyOn(service as any, 'backendRoles')
        .mockReturnValue(['guest', 'viewer']);

      expect(service['authorizedToChange']()).toBe(false);
    });
  });

  describe('get$', () => {
    it('should return null when not authorized to change', () => {
      (service as any)['authorizedToChange'] = signal(false);

      let result: any = null;
      service.get$().subscribe((val) => (result = val));

      expect(result).toBeNull();
    });

    it('should fetch system message when authorized', () => {
      const mockMessage = { active: true, message: 'Test message' };
      (service as any)['authorizedToChange'] = signal(true);
      const httpSpy = jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(of(mockMessage));
      jest.spyOn(service.loading, 'set');

      let result: any = null;
      service.get$().subscribe((val) => (result = val));

      expect(httpSpy).toHaveBeenCalledWith('api/system-message', {
        responseType: 'json',
      });
      expect(service.loading.set).toHaveBeenCalledWith(true);
      expect(service.loading.set).toHaveBeenCalledWith(false);
      expect(result).toEqual(mockMessage);
    });

    it('should handle error and return null', () => {
      (service as any)['authorizedToChange'] = signal(true);
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(throwError(() => new Error('Test error')));
      const snackbarSpy = jest.spyOn(service['snackbarService'], 'error');
      jest.spyOn(service.loading, 'set');

      let result: any;
      service.get$().subscribe((val) => (result = val));

      expect(snackbarSpy).toHaveBeenCalled();
      expect(service.loading.set).toHaveBeenCalledWith(false);
      expect(result).toBeNull();
    });
  });

  describe('put$', () => {
    it('should return EMPTY when not authorized to change', () => {
      (service as any)['authorizedToChange'] = signal(false);
      const message = {
        closable: true,
        type: AlertType.INFO,
        headline: '',
        active: true,
        message: 'Test message',
      };

      let completed = false;
      service.put$(message).subscribe({
        next: () => expect(true).toBe(false),
        complete: () => (completed = true),
      });

      expect(completed).toBe(true);
    });

    it('should update system message when authorized', () => {
      const message = {
        closable: true,
        type: AlertType.INFO,
        headline: '',
        active: true,
        message: 'Test message',
      };
      (service as any)['authorizedToChange'] = signal(true);
      const httpSpy = jest
        .spyOn(service['http'], 'put')
        .mockReturnValue(of(message));
      const snackbarSpy = jest.spyOn(service['snackbarService'], 'success');
      jest.spyOn(service.loading, 'set');

      let completed = false;
      service.put$(message).subscribe({
        next: () => expect(true).toBe(false),
        complete: () => (completed = true),
      });

      expect(httpSpy).toHaveBeenCalledWith('api/system-message', message);
      expect(service.loading.set).toHaveBeenCalledWith(true);
      expect(service.loading.set).toHaveBeenCalledWith(false);
      expect(snackbarSpy).toHaveBeenCalled();
      expect(completed).toBe(true);
    });

    it('should handle error when updating system message', () => {
      const message = {
        closable: true,
        type: AlertType.INFO,
        headline: '',
        active: true,
        message: 'Test message',
      };
      (service as any)['authorizedToChange'] = signal(true);
      jest
        .spyOn(service['http'], 'put')
        .mockReturnValue(throwError(() => new Error('Test error')));
      const snackbarSpy = jest.spyOn(service['snackbarService'], 'error');
      jest.spyOn(service.loading, 'set');

      let completed = false;
      service.put$(message).subscribe({
        next: () => expect(true).toBe(false),
        complete: () => (completed = true),
      });

      expect(snackbarSpy).toHaveBeenCalled();
      expect(service.loading.set).toHaveBeenCalledWith(false);
      expect(completed).toBe(true);
    });
  });
});
