import { MockProvider } from 'ng-mocks';
import { ToastrService } from 'ngx-toastr';

import { Stub } from '../../test/stub.class';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    service = Stub.get<SnackbarService>({
      component: SnackbarService,
      providers: [MockProvider(ToastrService)],
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should call toastr.show with correct parameters', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'show').mockReturnValue({} as any);

      const message = 'Test message';
      const title = 'Test title';
      const override = { timeOut: 5000 };
      const type = 'info' as any;

      service.show(message, title, override, type);

      expect(spy).toHaveBeenCalledWith(message, title, override, 'toast-info');
    });

    it('should use empty string as default title', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'show').mockReturnValue({} as any);

      const message = 'Test message';

      service.show(message);

      expect(spy).toHaveBeenCalledWith(message, '', undefined, '');
    });

    it('should set timeOut and extendedTimeOut to 0 for error type', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'show').mockReturnValue({} as any);

      const message = 'Error message';
      const title = 'Error title';
      const override = { progressBar: true };
      const type = 'error' as any;

      service.show(message, title, override, type);

      expect(spy).toHaveBeenCalledWith(
        message,
        title,
        { timeOut: 0, extendedTimeOut: 0, progressBar: true },
        'toast-error'
      );
    });

    it('should preserve user overrides for error type', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'show').mockReturnValue({} as any);

      const message = 'Error message';
      const type = 'error' as any;
      const override = { timeOut: 5000, extendedTimeOut: 3000 };

      service.show(message, '', override, type);

      expect(spy).toHaveBeenCalledWith(
        message,
        '',
        { timeOut: 5000, extendedTimeOut: 3000 },
        'toast-error'
      );
    });

    it('should not modify timeOut for non-error types', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'show').mockReturnValue({} as any);

      const message = 'Warning message';
      const type = 'warning' as any;
      const override = { progressBar: true };

      service.show(message, '', override, type);

      expect(spy).toHaveBeenCalledWith(message, '', override, 'toast-warning');
    });
  });

  describe('success', () => {
    it('should call toastr.success with correct parameters', () => {
      const toastrService = service['toastr'];
      const spy = jest
        .spyOn(toastrService, 'success')
        .mockReturnValue({} as any);

      const message = 'Success message';
      const title = 'Success title';
      const override = { timeOut: 5000 };

      service.success(message, title, override);

      expect(spy).toHaveBeenCalledWith(message, title, override);
    });

    it('should use empty string as default title', () => {
      const toastrService = service['toastr'];
      const spy = jest
        .spyOn(toastrService, 'success')
        .mockReturnValue({} as any);

      const message = 'Success message';

      service.success(message);

      expect(spy).toHaveBeenCalledWith(message, '', undefined);
    });
  });

  describe('error', () => {
    it('should call toastr.error with correct parameters including timeOut settings', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'error').mockReturnValue({} as any);

      const message = 'Error message';
      const title = 'Error title';
      const override = { progressBar: true };

      service.error(message, title, override);

      expect(spy).toHaveBeenCalledWith(message, title, {
        timeOut: 0,
        extendedTimeOut: 0,
        ...override,
      });
    });

    it('should use empty string as default title', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'error').mockReturnValue({} as any);

      const message = 'Error message';

      service.error(message);

      expect(spy).toHaveBeenCalledWith(message, '', {
        timeOut: 0,
        extendedTimeOut: 0,
      });
    });
  });

  describe('info', () => {
    it('should call toastr.info with correct parameters', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'info').mockReturnValue({} as any);

      const message = 'Info message';
      const title = 'Info title';
      const override = { timeOut: 5000 };

      service.info(message, title, override);

      expect(spy).toHaveBeenCalledWith(message, title, override);
    });

    it('should use empty string as default title', () => {
      const toastrService = service['toastr'];
      const spy = jest.spyOn(toastrService, 'info').mockReturnValue({} as any);

      const message = 'Info message';

      service.info(message);

      expect(spy).toHaveBeenCalledWith(message, '', undefined);
    });
  });

  describe('warning', () => {
    it('should call toastr.warning with correct parameters including timeOut settings', () => {
      const toastrService = service['toastr'];
      const spy = jest
        .spyOn(toastrService, 'warning')
        .mockReturnValue({} as any);

      const message = 'Warning message';
      const title = 'Warning title';
      const override = { progressBar: true };

      service.warning(message, title, override);

      expect(spy).toHaveBeenCalledWith(message, title, {
        ...override,
      });
    });

    it('should use empty string as default title', () => {
      const toastrService = service['toastr'];
      const spy = jest
        .spyOn(toastrService, 'warning')
        .mockReturnValue({} as any);

      const message = 'Warning message';

      service.warning(message);

      expect(spy).toHaveBeenCalledWith(message, '', undefined);
    });
  });

  describe('ensureToastPrefix', () => {
    it('should add toast- prefix if type does not start with toast-', () => {
      const result = service['ensureToastPrefix']('error');
      expect(result).toBe('toast-error');
    });

    it('should not add toast- prefix if type already starts with toast-', () => {
      const result = service['ensureToastPrefix']('toast-warning');
      expect(result).toBe('toast-warning');
    });

    it('should return empty string if type is undefined', () => {
      const result = service['ensureToastPrefix'](undefined as any);
      expect(result).toBe('');
    });
  });
});
