import { Component, input, output } from '@angular/core';

import { getMMAssetsPath } from '@mm/core/services/assets-path-resolver/assets-path-resolver.helper';

@Component({
  selector: 'mm-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
})
export class AppStoreButtonsComponent {
  public title? = input<string>();

  public appStoreClick = output<string>();

  public assetsPath = getMMAssetsPath();

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
