import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { environment } from '../../../environments/environment';
import { RawValue, RawValueContent, Result } from '../../shared/models';
import { ResultPageService } from './result-page.service';

@Component({
  selector: 'mm-result-page',
  templateUrl: './result-page.component.html',
  providers: [ResultPageService],
})
export class ResultPageComponent implements OnDestroy, OnChanges {
  @Input() public active? = false;
  @Input() public bearing? = '';

  public result$ = new BehaviorSubject<Result>(undefined);
  public error$ = new BehaviorSubject<boolean>(false);
  private readonly inactive$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private lastFormData?: FormGroup;
  public reportSelector = environment.reportSelector;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public constructor(
    private readonly resultPageService: ResultPageService,
    private readonly snackbar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes.active?.currentValue) {
      this.inactive$.next();
      this.snackBarRef?.dismiss();
    }
    if (changes.active?.currentValue && this.error$.value) {
      this.send(this.lastFormData);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public send(form: FormGroup): void {
    this.error$.next(false);
    this.lastFormData = form;
    // TODO: check lint rules
    const formProperties = form
      .getRawValue()
      // eslint-disable-next-line unicorn/no-array-reduce
      .objects[0].properties.reduce(
        (
          { dimension1, initialValue, ...prevEntry }: RawValue,
          { name, value }: RawValueContent
        ) => {
          const key = name === 'RSY_BEARING' ? 'IDCO_DESIGNATION' : name;

          return {
            ...prevEntry,
            [key]: value,
          };
        },
        {}
      );

    // eslint-disable-next-line unicorn/no-useless-undefined
    this.result$.next(undefined);

    this.resultPageService
      .getResult(formProperties)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.result$.next(result);
        },
        error: (err) => {
          this.error$.next(true);
          this.snackBarRef = this.snackbar.open(
            err,
            this.translocoService.translate('error.retry'),
            {
              duration: Number.POSITIVE_INFINITY,
            }
          );

          this.snackBarRef
            ?.afterDismissed()
            .pipe(takeUntil(this.inactive$))
            .subscribe(() => {
              this.send(form);
            });
        },
      });
  }

  public get errorMsg(): string {
    return this.translocoService.translate('error.content');
  }

  public get actionText(): string {
    return this.translocoService.translate('error.retry');
  }

  public resetWizard(): void {
    window.location.reload();
  }
}
