import { ChangeDetectionStrategy, Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { Toast } from 'ngx-toastr';

import { AlertComponent, AlertType } from '@schaeffler/alert';

import { Animations } from '../../utils/animations';

@Component({
  selector: 'd360-snackbar',
  imports: [AlertComponent],
  template: `<schaeffler-alert
    class="no-html"
    [type]="type"
    [headline]="title"
    [actionText]="buttonName"
    [description]="message"
    (buttonClicked)="tapToast()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.flyInOut],
  preserveWhitespaces: false,
})
export class SnackbarComponent extends Toast {
  protected get type(): AlertType {
    switch (this.toastPackage.toastType) {
      case 'error':
      case 'toast-error': {
        return 'error';
      }

      case 'info':
      case 'toast-info': {
        return 'info';
      }

      case 'warning':
      case 'toast-warning': {
        return 'warning';
      }

      default: {
        return 'success';
      }
    }
  }

  protected get buttonName(): AlertType {
    return (
      this.toastPackage.config?.payload?.buttonName ?? translate('button.close')
    );
  }
}
