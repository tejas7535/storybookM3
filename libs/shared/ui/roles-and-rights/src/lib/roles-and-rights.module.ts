import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { LabelValueModule } from '@schaeffler/label-value';

import { RolesComponent } from './components/roles/roles.component';
import { RolesAndRightsComponent } from './components/roles-and-rights/roles-and-rights.component';
import { RolesGroupsComponent } from './components/roles-groups/roles-groups.component';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    MatExpansionModule,
    LabelValueModule,
  ],
  declarations: [RolesAndRightsComponent, RolesGroupsComponent, RolesComponent],
  exports: [RolesAndRightsComponent],
})
export class RolesAndRightsModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
