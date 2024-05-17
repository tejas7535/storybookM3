import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { BannerModule } from '@schaeffler/banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SystemMessage } from '../../../shared/models/system-message';
import { SharedModule } from '../../../shared/shared.module';
import { openIABanner } from '../../store/actions/user.action';

@Component({
  selector: 'ia-system-message-banner',
  template: ` <schaeffler-banner
    [class]="'ia-banner-type-' + systemMessage?.type"
  ></schaeffler-banner>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule, SharedTranslocoModule, BannerModule],
  styleUrls: ['./system-message-banner.component.scss'],
})
export class SystemMessageBannerComponent {
  private _systemMessage: SystemMessage;

  get systemMessage() {
    return this._systemMessage;
  }

  @Input() set systemMessage(systemMessage: SystemMessage) {
    this._systemMessage = systemMessage;
    this.openBanner(systemMessage);
  }

  constructor(private readonly store: Store) {}

  openBanner(systemMessage: SystemMessage): void {
    this.store.dispatch(openIABanner({ systemMessage }));
  }
}
