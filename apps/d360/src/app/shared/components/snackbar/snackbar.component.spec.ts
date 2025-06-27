import { MockProvider } from 'ng-mocks';
import { OverlayRef, ToastPackage, ToastRef, ToastrService } from 'ngx-toastr';

import { Stub } from '../../test/stub.class';
import { SnackbarComponent } from './snackbar.component';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let mockToastPackage: ToastPackage;

  beforeEach(async () => {
    mockToastPackage = new ToastPackage(
      1,
      {} as any,
      'Test Message',
      'Test Title',
      'toast-success',
      new ToastRef<any>(new OverlayRef(null))
    );

    component = Stub.getForEffect<SnackbarComponent>({
      component: SnackbarComponent,
      providers: [
        MockProvider(ToastrService),
        { provide: ToastPackage, useValue: mockToastPackage },
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('type getter', () => {
    it('should return "error" for toast-error type', () => {
      mockToastPackage.toastType = 'toast-error';
      expect(component['type']).toBe('error');
    });

    it('should return "info" for toast-info type', () => {
      mockToastPackage.toastType = 'toast-info';
      expect(component['type']).toBe('info');
    });

    it('should return "warning" for toast-warning type', () => {
      mockToastPackage.toastType = 'toast-warning';
      expect(component['type']).toBe('warning');
    });

    it('should return "success" as default for other toast types', () => {
      mockToastPackage.toastType = 'toast-success';
      expect(component['type']).toBe('success');

      mockToastPackage.toastType = 'unknown-type';
      expect(component['type']).toBe('success');
    });
  });

  describe('buttonName getter', () => {
    it('should return buttonName from config payload if provided', () => {
      (mockToastPackage as any).config = {
        payload: { buttonName: 'Custom Button' },
      };
      expect(component['buttonName']).toBe('Custom Button');
    });

    it('should return translated "button.close" when no buttonName in config', () => {
      (mockToastPackage as any).config = { payload: {} };
      expect(component['buttonName']).toBe('button.close');
    });

    it('should handle null config gracefully', () => {
      mockToastPackage.config = null;
      expect(component['buttonName']).toBe('button.close');
    });
  });

  describe('remove method', () => {
    it('should call the remove method of the toast', () => {
      const removeSpy = jest.spyOn(component, 'remove');
      component.remove();
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
