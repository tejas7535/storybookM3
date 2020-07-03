import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ForbiddenComponent } from './forbidden.component';

const routes = [
  {
    path: '',
    component: ForbiddenComponent,
  },
];

export const forbiddenLoader = ['en', 'de'].reduce((acc: any, lang: string) => {
  acc[lang] = () => import(`./i18n/${lang}.json`);

  return acc;
}, {});

@NgModule({
  declarations: [ForbiddenComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    SharedTranslocoModule.forChild('forbidden', forbiddenLoader),
  ],
})
export class ForbiddenModule {}
