import { inject, Injectable } from '@angular/core';

import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

import { AlertType } from '@schaeffler/alert';

import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly toastr: ToastrService = inject(ToastrService);

  public show(
    message: string,
    title: string = '',
    override?: Partial<IndividualConfig>,
    type?: AlertType
  ): ActiveToast<SnackbarComponent> {
    const overrides =
      type === 'error'
        ? { timeOut: 0, extendedTimeOut: 0, ...override }
        : override;

    return this.toastr.show(
      message,
      title,
      overrides,
      this.ensureToastPrefix(type)
    );
  }

  public success(
    message: string,
    title: string = '',
    override?: Partial<IndividualConfig>
  ): ActiveToast<SnackbarComponent> {
    return this.toastr.success(message, title, override);
  }

  public error(
    message: string,
    title: string = '',
    override?: Partial<IndividualConfig>
  ): ActiveToast<SnackbarComponent> {
    return this.toastr.error(message, title, {
      timeOut: 0,
      extendedTimeOut: 0,
      ...override,
    });
  }

  public info(
    message: string,
    title: string = '',
    override?: Partial<IndividualConfig>
  ): ActiveToast<SnackbarComponent> {
    return this.toastr.info(message, title, override);
  }

  public warning(
    message: string,
    title: string = '',
    override?: Partial<IndividualConfig>
  ): ActiveToast<SnackbarComponent> {
    return this.toastr.warning(message, title, override);
  }

  private ensureToastPrefix(type?: string): string {
    return type && !type.startsWith('toast-') ? `toast-${type}` : type || '';
  }
}
