import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { Quotation } from '../../shared/models';

@Component({
  selector: 'gq-header-content',
  styleUrls: ['./header-content.component.scss'],
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent implements OnInit, OnDestroy {
  public gqHeader$: Observable<string>;
  public sapHeader$: Observable<string>;
  public editCaseNameMode = false;
  public caseName: string;
  public caseNameInput: string;
  public saveCaseNameEnabled = false;
  public caseNameFormControl: FormControl = new FormControl();

  private readonly subscription: Subscription = new Subscription();

  @Output() displayTitle = new EventEmitter<boolean>();
  @Output() updateCaseName = new EventEmitter<string>();

  @Input() set quotation(value: Quotation) {
    if (value) {
      if (value.caseName) {
        this.caseName = value.caseName;
        this.caseNameFormControl.setValue(this.caseName);
      }

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

  ngOnInit(): void {
    this.subscription.add(
      this.caseNameFormControl.valueChanges.subscribe((value: string) => {
        this.caseNameInput = value.trim();
        this.saveCaseNameEnabled =
          this.caseName === undefined
            ? this.caseNameInput.length > 0
            : this.caseNameInput !== this.caseName;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleCaseNameEditing(display: boolean): void {
    this.editCaseNameMode = display;
    this.displayTitle.emit(!display);
  }

  public saveCaseName(): void {
    if (this.saveCaseNameEnabled) {
      this.updateCaseName.emit(this.caseNameInput);

      this.toggleCaseNameEditing(false);
    }
  }
}
