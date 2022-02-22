import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import { PERSON_RESPONSIBLE, PURPOSE, TERMS_OF_USE } from './legal.model';
import { LegalPath } from './legal-route-path.enum';

@Component({
  selector: 'schaeffler-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LegalComponent implements OnInit, OnDestroy {
  public responsible?: string = undefined;
  public purpose?: string = undefined;
  public legal = 'imprint';
  public destroy$ = new Subject<void>();

  public constructor(
    @Optional() @Inject(PERSON_RESPONSIBLE) public personResponsible: string,
    @Optional() @Inject(PURPOSE) public purpose$: Observable<any>,
    @Optional() @Inject(TERMS_OF_USE) public termsOfUse$: Observable<any>,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.responsible =
      this.personResponsible &&
      translate('responsibleIntro', {
        personResponsible: this.personResponsible,
      });

    this.purpose$.subscribe((value) => (this.purpose = value));

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
