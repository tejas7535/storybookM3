import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import { PERSON_RESPONSIBLE } from './legal.model';
import { LegalPath } from './legal-route-path.enum';

@Component({
  selector: 'schaeffler-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LegalComponent implements OnInit, OnDestroy {
  public responsible?: string = undefined;
  public legal = 'imprint';
  public destroy$ = new Subject<void>();

  public constructor(
    @Inject(PERSON_RESPONSIBLE) private readonly personResponsible: string,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.responsible =
      this.personResponsible &&
      translate('responsibleIntro', {
        personResponsible: this.personResponsible,
      });

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
            this.legal = 'imprint';
            break;
          case LegalPath.DataprivacyPath:
            this.legal = 'dataPrivacy';
            break;
          case LegalPath.TermsPath:
            this.legal = 'termsOfUse';
            break;
          case LegalPath.CookiePath:
            this.legal = 'cookiePolicy';
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

  public navigate(): void {
    this.router.navigate(['/']);
  }
}
