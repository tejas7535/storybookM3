import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlSerializer } from '@angular/router';

import { take } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { DataFacade } from '@mac/msd/store/facades/data';
import { changeFavicon } from '@mac/shared/change-favicon';

@Component({
  selector: 'mac-materials-supplier-database',
  templateUrl: './materials-supplier-database.component.html',
})
export class MaterialsSupplierDatabaseComponent implements OnInit {
  public breadcrumbs: Breadcrumb[];

  public constructor(
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly urlSerializer: UrlSerializer,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly translocoService: TranslocoService
  ) {
    this.breadcrumbs = [
      { label: this.translocoService.translate('title'), url: '/overview' },
      {
        label: this.translocoService.translate(
          'materialsSupplierDatabase.title'
        ),
      },
    ];
  }

  public ngOnInit(): void {
    this.applicationInsightsService.logEvent('[MAC - MSD] opened');
    changeFavicon(
      '../assets/favicons/msd.ico',
      this.translocoService.translate('materialsSupplierDatabase.title')
    );
  }

  public shareButtonFn(): void {
    this.dataFacade.shareQueryParams$
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
            this.translocoService.translate(
              'materialsSupplierDatabase.filterTooLong'
            ),
            this.translocoService.translate('materialsSupplierDatabase.close')
          );
        } else {
          this.clipboard.copy(`${window.location.origin}${url}`);
          this.snackbar.open(
            this.translocoService.translate(
              'materialsSupplierDatabase.shareCopiedToClipboard'
            ),
            this.translocoService.translate('materialsSupplierDatabase.close')
          );
        }
      });
  }
}
