import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, UrlSerializer } from '@angular/router';

import { take } from 'rxjs/operators';

import { TranslocoService } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DataFacade } from '@mac/msd/store/facades/data';
import { changeFavicon } from '@mac/shared/change-favicon';

import { MsdDialogService } from './services';

@Component({
  selector: 'mac-materials-supplier-database',
  templateUrl: './materials-supplier-database.component.html',
  imports: [
    // default
    RouterModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    // libs
    SharedTranslocoModule,
    SubheaderModule,
  ],
  providers: [MsdDialogService],
})
export class MaterialsSupplierDatabaseComponent implements OnInit {
  public breadcrumbs: Breadcrumb[];

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly urlSerializer: UrlSerializer,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: MsdDialogService
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

  ngOnInit(): void {
    this.applicationInsightsService.logEvent('[MAC - MSD] opened');
    changeFavicon(
      '../assets/favicons/msd.ico',
      this.translocoService.translate('materialsSupplierDatabase.title')
    );
  }

  shareButtonFn(): void {
    this.dataFacade.shareQueryParams$.pipe(take(1)).subscribe((params) => {
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

  contactButtonFn(): void {
    this.dialogService.openContactDialog();
  }
}
