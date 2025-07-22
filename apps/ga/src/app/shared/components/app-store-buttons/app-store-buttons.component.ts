import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Capacitor } from '@capacitor/core';

import {
  EMAPlatform,
  getAssetsPath,
} from '@schaeffler/engineering-apps-behaviors/utils';

import { environment } from '@ga/environments/environment';

@Component({
  selector: 'ga-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
})
export class AppStoreButtonsComponent {
  @Input() public title?: string;

  @Output() public appStoreClick = new EventEmitter<string>();

  public assetsPath = getAssetsPath(
    environment.assetsPath,
    Capacitor.isNativePlatform()
      ? (Capacitor.getPlatform() as EMAPlatform)
      : undefined
  );

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
