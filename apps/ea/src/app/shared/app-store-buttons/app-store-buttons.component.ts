import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { getAssetsPath } from '@ea/core/services/assets-path-resolver/assets-path-resolver.helper';
import { SettingsFacade } from '@ea/core/store';

@Component({
  selector: 'ea-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppStoreButtonsComponent {
  @Input() public title?: string;

  @Output() public appStoreClick = new EventEmitter<string>();

  public readonly isNativeMobile;

  public readonly imagePathBase = `${getAssetsPath()}/icons/store-badges`;
  public readonly iOSStore = `${this.imagePathBase}/apple-appstore-badge.svg`;
  public readonly playStore = `${this.imagePathBase}/google-play-badge.png`;

  constructor(settingsFacade: SettingsFacade) {
    this.isNativeMobile = settingsFacade.isNativeMobile;
  }

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
