/* eslint-disable */
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { PageNotFoundComponent } from './page-not-found.component';

const routes = [
  {
    path: '',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    TranslocoModule,
    RouterModule.forChild(routes),
  ],
  exports: [PageNotFoundComponent],
})
export class PageNotFoundModule {
  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
