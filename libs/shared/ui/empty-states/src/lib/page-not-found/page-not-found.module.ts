import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PageNotFoundComponent } from './page-not-found.component';

const routes = [
  {
    path: '',
    component: PageNotFoundComponent,
  },
];

export const pageNotFoundLoader = ['en', 'de'].reduce(
  (acc: any, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {}
);

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    SharedTranslocoModule.forChild('pageNotFound', pageNotFoundLoader),
    RouterModule.forChild(routes),
  ],
  exports: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
