import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

export const loader = ['en', 'de'].reduce((acc: any, lang: string) => {
  acc[lang] = () => import(`./i18n/${lang}.json`);

  return acc;
}, {});

@Component({
  selector: 'schaeffler-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        loader,
        scope: 'forbidden',
      },
    },
  ],
})
export class ForbiddenComponent {
  public action: string;

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.action = this.activatedRoute.snapshot.data.action;
  }
}
