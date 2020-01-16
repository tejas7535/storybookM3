import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import {
  sharedScopeLoader,
  SharedTranslocoModule
} from '@schaeffler/shared/transloco';

import { PageNotFoundComponent } from './page-not-found.component';

const routes = [
  {
    path: '',
    component: PageNotFoundComponent
  }
];

// tslint:disable-next-line: only-arrow-functions
export async function importer(lang: string, root: string): Promise<any> {
  return import(`./${root}/${lang}.json`);
}

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    SharedTranslocoModule.forChild(
      'pageNotFound',
      sharedScopeLoader(['de', 'en'], importer)
    ),
    RouterModule.forChild(routes)
  ],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
