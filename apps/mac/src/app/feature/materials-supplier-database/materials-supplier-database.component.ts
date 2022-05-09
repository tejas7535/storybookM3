import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlSerializer } from '@angular/router';

import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { changeFavicon } from '../../shared/change-favicon';
import { getShareQueryParams } from './store';

@Component({
  selector: 'mac-materials-supplier-database',
  templateUrl: './materials-supplier-database.component.html',
})
export class MaterialsSupplierDatabaseComponent implements OnInit {
  public title = 'Materials Supplier Database';

  public breadcrumbs: Breadcrumb[] = [
    { label: 'Materials App Center', url: '/overview' },
    {
      label: this.title,
    },
  ];

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly urlSerializer: UrlSerializer,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightsService.logEvent('[MAC - MSD] opened');
    changeFavicon('../assets/favicons/msd.ico', 'Materials Supplier Database');
  }

  public shareButtonFn(): void {
    this.store
      .select(getShareQueryParams)
      .pipe(take(1))
      .subscribe((params: { filterForm: string; agGridFilter: string }) => {
        const tree = this.router.parseUrl(this.router.url);
        tree.queryParams = params;
        const url = this.urlSerializer.serialize(tree);

        this.applicationInsightsService.logEvent(
          '[MAC - MSD] Share link copied',
          { tooLong: url.length > 2000 }
        );
        if (url.length > 2000) {
          this.snackbar.open(
            'The table filter is too long to be put into a link',
            'Close'
          );
        } else {
          this.clipboard.copy(`${window.location.origin}${url}`);
          this.snackbar.open('Link copied to clipboard', 'Close');
        }
      });
  }
}
