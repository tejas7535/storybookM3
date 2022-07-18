import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap, startWith } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import {
  CUSTOM_DATA_PRIVACY,
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from './legal.model';
import { LegalPath } from './legal-route-path.enum';
@Component({
  selector: 'schaeffler-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LegalComponent implements OnInit {
  public LegalRoutePath = LegalPath;
  public translationContent$!: Observable<string>;
  public lastPath$!: Observable<string>;

  public constructor(
    @Inject(PERSON_RESPONSIBLE) public personResponsible: string,
    @Optional() @Inject(PURPOSE) public purpose$: Observable<any>,
    @Optional() @Inject(TERMS_OF_USE) public termsOfUse$: Observable<any>,
    @Optional()
    @Inject(CUSTOM_DATA_PRIVACY)
    public customDataPrivacy$: Observable<string>,
    @Optional() @Inject(DATA_SOURCE) public dataSource$: Observable<any>,
    @Optional() @Inject(STORAGE_PERIOD) public storagePeriod$: Observable<any>,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.lastPath$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith({ url: this.route.snapshot.url[0].path } as NavigationEnd),
      map((event) => (event as NavigationEnd).url.split('/').pop() as string)
    );

    this.translationContent$ = this.lastPath$.pipe(
      mergeMap((path) => {
        if (path === LegalPath.DataprivacyPath && this.customDataPrivacy$) {
          return this.customDataPrivacy$;
        }

        const defaultTranslateOptions = {
          responsible: translate('responsibleIntro', {
            personResponsible: this.personResponsible,
          }),
          personResponsible: this.personResponsible,
        };

        return combineLatest([
          this.purpose$ ?? of(''),
          this.dataSource$ ?? of(translate('defaultDataSource')),
          this.storagePeriod$ ?? of(translate('defaultPeriod')),
        ]).pipe(
          map(([purpose, dataSource, storagePeriod]) =>
            translate(path, {
              ...defaultTranslateOptions,
              purpose,
              dataSource,
              storagePeriod,
            })
          )
        );
      })
    );
  }

  public navigate(): void {
    this.router.navigate(['/']);
  }
}
