import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { LegalPath } from './legal-route-path.enum';

@Component({
  selector: 'mm-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LegalComponent implements OnInit, OnDestroy {
  public legal: string;
  public destroy$ = new Subject<void>();

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
        startWith({ url: this.route.snapshot.url[0].path } as NavigationEnd)
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).url?.split('/').pop();

        switch (url) {
          case LegalPath.ImprintPath:
            this.legal = 'content.imprint';
            break;
          case LegalPath.DataprivacyPath:
            this.legal = 'content.dataPrivacy';
            break;
          case LegalPath.TermsPath:
            this.legal = 'content.termsOfUse';
            break;
          case LegalPath.CookiePath:
            this.legal = 'content.cookiePolicy';
            break;
          default:
            break;
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
