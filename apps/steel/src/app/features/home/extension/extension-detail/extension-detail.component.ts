import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Icon } from '@schaeffler/icons';
import { SnackBarService } from '@schaeffler/snackbar';

import { RestService } from '../../../../core/services/rest.service';
import { Extension } from '../../extension/extension.model';

@Component({
  selector: 'schaeffler-steel-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss'],
})
export class ExtensionDetailComponent implements OnInit, OnDestroy {
  public backIcon = new Icon('icon-arrow-west');
  public warningIcon = new Icon('report_problem', true);
  public langIcon = new Icon('language', true);
  public extension: Extension;
  public extensionName = '';
  public url = window.location.href;
  public readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly restService: RestService,
    private readonly snackBarService: SnackBarService
  ) {}

  public ngOnInit(): void {
    const filterName = this.route.snapshot.params.name;

    this.subscription.add(
      this.restService
        .getExtensions()
        .pipe(
          map(
            (exts: Extension[]) =>
              exts.filter((elem) => elem.name === filterName)[0]
          )
        )
        .subscribe((extension: Extension) => (this.extension = extension))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public showCopySuccess(): void {
    this.snackBarService.showSuccessMessage('Copied to clipboard');
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }

  getMaterialIcon(icon: string): Icon {
    return new Icon(icon, true);
  }
}
