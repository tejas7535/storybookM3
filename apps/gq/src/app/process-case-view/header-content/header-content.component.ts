import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Quotation } from '../../shared/models';

@Component({
  selector: 'gq-header-content',
  styleUrls: ['./header-content.component.scss'],
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  public gqHeader$: Observable<string>;
  public sapHeader$: Observable<string>;
  public editCaseNameMode = false;
  public caseName: string;
  public saveCaseNameEnabled = false;
  public currency: string;

  @Output() updateCaseName = new EventEmitter<string>();
  @Output() updateCurrency = new EventEmitter<string>();

  @Input() set quotation(value: Quotation) {
    if (value) {
      if (value.caseName) {
        this.caseName = value.caseName;
      }

      this.currency = value.currency;

      const datePipe = new DatePipe('en');
      const transformFormat = 'dd.MM.yyyy HH:mm';

      this.gqHeader$ = this.translocoService.selectTranslate(
        'header.gqHeader',
        {
          gqCreationName: value.gqCreatedByUser.name,
          gqCreationDate: datePipe.transform(value.gqCreated, transformFormat),
          gqUpdatedName: value.gqLastUpdatedByUser.name,
          gqUpdatedDate: datePipe.transform(
            value.gqLastUpdated,
            transformFormat
          ),
        },
        'process-case-view'
      );

      if (value.sapId) {
        this.sapHeader$ = this.translocoService.selectTranslate(
          'header.sapHeader',
          {
            sapCreationName: value.sapCreatedByUser.name,
            sapCreationDate: datePipe.transform(
              value.sapCreated,
              transformFormat
            ),
            sapUpdatedDate: datePipe.transform(
              value.sapLastUpdated,
              transformFormat
            ),
          },
          'process-case-view'
        );
      }
    }
  }

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly matDialog: MatDialog
  ) {}

  public openCaseEditingModal(): void {
    this.matDialog
      .open(EditCaseModalComponent, {
        width: '480px',
        data: {
          caseName: this.caseName,
          currency: this.currency,
        },
      })
      .afterClosed()
      .subscribe((result?: { caseName: string; currency: string }) => {
        if (result && result.caseName !== this.caseName) {
          this.updateCaseName.emit(result.caseName);
        }

        if (result?.currency && result.currency !== this.currency) {
          this.updateCurrency.emit(result.currency);
        }
      });
  }
}
