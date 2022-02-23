import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { UnderConstructionComponent } from './under-construction.component';

const routes = [
  {
    path: '',
    component: UnderConstructionComponent,
  },
];

@NgModule({
  declarations: [UnderConstructionComponent],
  imports: [TranslocoModule, RouterModule.forChild(routes)],
  exports: [UnderConstructionComponent],
})
export class UnderConstructionModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
