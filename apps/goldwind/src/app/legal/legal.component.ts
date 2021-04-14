import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { dataprivacy, imprint, terms } from '../../assets/legal';
import { LegalPath } from './legal-route-path.enum';

@Component({
  selector: 'goldwind-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
})
export class LegalComponent implements OnInit, OnDestroy {
  legal = imprint;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
            this.legal = imprint;
            break;
          case LegalPath.DataprivacyPath:
            this.legal = dataprivacy;
            break;
          case LegalPath.TermsPath:
            this.legal = terms;
            break;
          default:
            this.legal = imprint;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
