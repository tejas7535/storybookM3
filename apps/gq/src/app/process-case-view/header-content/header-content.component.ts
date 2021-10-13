import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { Quotation } from '../../shared/models';

@Component({
  selector: 'gq-header-content',
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  public gqHeader$: Observable<string>;
  public sapHeader$: Observable<string>;

  @Input() set quotation(value: Quotation) {
    if (value) {
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

  constructor(private readonly translocoService: TranslocoService) {}
}
