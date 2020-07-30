import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UnderConstructionComponent } from './under-construction.component';

const routes = [
  {
    path: '',
    component: UnderConstructionComponent,
  },
];

export const underConstructionLoader = ['en', 'de'].reduce(
  (acc: any, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {}
);

@NgModule({
  declarations: [UnderConstructionComponent],
  imports: [
    FlexLayoutModule,
    SharedTranslocoModule.forChild(
      'underConstruction',
      underConstructionLoader
    ),
    RouterModule.forChild(routes),
  ],
  exports: [UnderConstructionComponent],
})
export class UnderConstructionModule {}
