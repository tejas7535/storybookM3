/* eslint-disable */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { ForbiddenComponent } from './forbidden.component';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';

const routes = [
  {
    path: '',
    component: ForbiddenComponent,
  },
];

@NgModule({
  declarations: [ForbiddenComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    TranslocoModule,
  ],
  exports: [ForbiddenComponent],
})
export class ForbiddenModule {
  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
