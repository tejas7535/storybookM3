import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { map, Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { FeedbackDialogComponent } from '../shared/dialogs/feedback-dialog/feedback-dialog.component';
import { submitUserFeedback } from './store/actions/user.action';
import { getSubmitFeedbackLoading } from './store/selectors/user.selector';

@Component({
  selector: 'ia-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  readonly DIALOG_MAX_WIDTH = '50vw';

  subscription: Subscription;
  isSubmitInProgress$: Observable<boolean>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.isSubmitInProgress$ = this.store.select(getSubmitFeedbackLoading);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openFeedbackDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      maxWidth: this.DIALOG_MAX_WIDTH,
      disableClose: true,
      data: {
        loading: this.isSubmitInProgress$,
      },
    });

    this.subscription = dialogRef.componentInstance.onFeebackSubmitted
      .pipe(
        map((feedback) => this.store.dispatch(submitUserFeedback({ feedback })))
      )
      .subscribe();
  }
}
