import { NgModule } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { MaintenanceComponent } from './maintenance.component';

@NgModule({
  declarations: [MaintenanceComponent],
  imports: [TranslocoModule],
  exports: [MaintenanceComponent],
})
export class MaintenanceModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
