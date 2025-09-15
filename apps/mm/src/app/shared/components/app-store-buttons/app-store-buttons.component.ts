import { Component, inject, input, output } from '@angular/core';

import { EaDeliveryService } from '@schaeffler/engineering-apps-behaviors/utils';

@Component({
  selector: 'mm-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
})
export class AppStoreButtonsComponent {
  private readonly deliveryService = inject(EaDeliveryService);

  public title? = input<string>();

  public appStoreClick = output<string>();

  public assetsPath = this.deliveryService.assetsPath;

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
