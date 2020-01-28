import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { PageNotFoundComponent } from './page-not-found.component';

const routes = [
  {
    path: '',
    component: PageNotFoundComponent
  }
];

// tslint:disable: only-arrow-functions
export function de(): any {
  return import('./i18n/de.json');
}

export function en(): any {
  return import('./i18n/en.json');
}

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    SharedTranslocoModule.forChild('pageNotFound', { en, de }),
    RouterModule.forChild(routes)
  ],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
