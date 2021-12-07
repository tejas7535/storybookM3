import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { RoleDescriptionsDialogComponent } from '@cdba/shared/components/role-descriptions/role-descriptions-dialog/role-descriptions-dialog.component';

import { ForbiddenEventService } from '@schaeffler/empty-states';

@Component({
  selector: 'cdba-empty-states',
  templateUrl: './empty-states.component.html',
})
export class EmptyStatesComponent implements OnInit, OnDestroy {
  forbiddenPageActionButtonSubscription: Subscription;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly forbiddenEventService: ForbiddenEventService
  ) {}

  public ngOnInit(): void {
    this.forbiddenPageActionButtonSubscription =
      this.forbiddenEventService.forbiddenPageActionButtonClicked$.subscribe(
        () => {
          this.dialog.open(RoleDescriptionsDialogComponent, {
            width: '650px',
            maxWidth: '90%',
          });
        }
      );
  }

  public ngOnDestroy(): void {
    if (this.forbiddenPageActionButtonSubscription) {
      this.forbiddenPageActionButtonSubscription.unsubscribe();
    }
  }
}
