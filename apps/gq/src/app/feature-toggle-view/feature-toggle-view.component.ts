import { Component } from '@angular/core';
import { MatLegacySlideToggleChange as MatSlideToggleChange } from '@angular/material/legacy-slide-toggle';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-feature-toggle-view',
  templateUrl: './feature-toggle-view.component.html',
})
export class FeatureToggleViewComponent {
  public configs: { key: string; value: boolean }[] = [];
  public isDefaultConfig = true;

  constructor(
    private readonly featureToggleService: FeatureToggleConfigService
  ) {
    for (const [key, value] of Object.entries(
      this.featureToggleService.Config
    )) {
      this.configs.push({ key, value: value as boolean });
    }

    this.isDefaultConfig = this.featureToggleService.isProduction;
  }

  /**
   * event fired by the slideToggles
   *
   * @param toggleChange matSlide that fire the event
   */
  public featureToggleChanged(toggleChange: MatSlideToggleChange) {
    const itemFound = this.configs.findIndex(
      (item) => item.key === toggleChange.source.name
    );
    if (itemFound > -1) {
      this.configs[itemFound].value = toggleChange.checked;
      // this.configs.find((item) => item.key === toggleChange.source.name).value =
      //   toggleChange.checked;
    }
  }

  /**
   * save the changed config
   */
  public saveConfig(): void {
    const updatedConfig: any = {};

    this.configs.forEach((item) => {
      updatedConfig[item.key] = item.value;
    });

    this.featureToggleService.saveConfigToLocalStorage(updatedConfig);
  }
}
