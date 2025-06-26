import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { catchError, combineLatest, EMPTY, filter, take, tap } from 'rxjs';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { ValidDate } from '@jsverse/transloco-locale';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ValidateForm } from '../../../../shared/decorators';
import { CommentCreateRequest } from '../../../../shared/models/comments.model';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { SalesPlanningService } from './../../../../feature/sales-planning/sales-planning.service';
import { CommentsDataSourceService } from './comments-datasource.service';

@Component({
  selector: 'd360-comments-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScrollingModule,
    MatDialogModule,
    MatCardModule,
    TranslocoModule,
    LoadingSpinnerModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIcon,
  ],
  providers: [CommentsDataSourceService],
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent implements AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport)
  private readonly viewport: CdkVirtualScrollViewport;

  protected readonly maxLength = 500;

  protected readonly dataSource: CommentsDataSourceService = inject(
    CommentsDataSourceService
  );
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly salesPlanningService: SalesPlanningService =
    inject(SalesPlanningService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly dialogData: { customerNumber: string } =
    inject(MAT_DIALOG_DATA);

  protected loading = signal<boolean>(true);

  protected readonly form = new FormGroup({
    text: new FormControl<string | null>(null, {
      validators: Validators.required,
    }),
  });

  protected getDate(date: ValidDate): string {
    return ValidationHelper.localeService.localizeDate(
      date,
      ValidationHelper.localeService.getLocale(),
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  }

  public ngAfterViewInit(): void {
    combineLatest([
      this.dataSource.loaded$,
      this.dataSource.secondLoadNeeded$,
      this.dataSource.secondLoaded$,
    ])
      .pipe(
        filter(([loaded, secondLoadNeeded, secondLoaded]) => {
          if (secondLoadNeeded) {
            this.scrollToBottom();

            return false;
          }

          return loaded || secondLoaded;
        }),
        take(1),
        tap(() => {
          this.loading.set(false);
          this.scrollToBottom();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.dataSource.scrollingNeeded$
      .pipe(
        filter((refresh) => refresh),
        tap(() => this.scrollToBottom()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  @ValidateForm('form')
  protected onSubmit(): void {
    if (this.form.valid) {
      this.salesPlanningService
        .postComment$(
          this.form.value as CommentCreateRequest,
          this.dialogData.customerNumber
        )
        .pipe(
          take(1),

          tap(() => {
            this.dataSource.refreshLastPage(this.dataSource.length + 1);
            this.form.reset();
            Object.keys(this.form.controls).forEach((key) => {
              this.form.get(key).setErrors(null);
            });
          }),

          catchError(() => {
            this.snackbarService.openSnackBar(translate('error.save.failed'));

            return EMPTY;
          }),

          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  private scrollToBottom(): void {
    // Hint: This is a (hacky) workaround to ensure the viewport scrolls to the bottom after the data is loaded.
    // It may not be necessary in all cases, but it helps to ensure the viewport is scrolled to the bottom.
    setTimeout(() => this.viewport.scrollTo({ bottom: 0 }), 100);
    setTimeout(() => this.viewport.scrollTo({ bottom: 0 }), 200);
  }
}
