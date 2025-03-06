import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Store } from '@ngrx/store';

import { getAccessToken } from '@schaeffler/azure-auth';

import {
  trackBomExportStatusCompleted,
  trackBomExportStatusFailure,
  updateBomExportStatus,
} from '@cdba/core/store/actions/user-interaction/user-interaction.actions';
import { BomExportFeature } from '@cdba/core/store/reducers/user-interaction/user-interaction.reducer';
import { getBomExportFeature } from '@cdba/core/store/selectors/user-interaction/user-interaction.selector';
import { API, BomExportStatusLivePath } from '@cdba/shared/constants/api';

import { UserInteractionDialogComponent } from './dialog/user-interaction-dialog.component';
import { BomExportProgress, BomExportStatus } from './model/feature/bom-export';

@Component({
  selector: 'cdba-user-interaction',
  templateUrl: './user-interaction.component.html',
  standalone: false,
})
export class UserInteractionComponent implements OnInit, OnDestroy {
  username: string;

  private readonly dialog = inject(MatDialog);

  private readonly authToken$ = this.store.select(getAccessToken);
  private readonly bomExportFeature$ = this.store.select(getBomExportFeature);

  private token: string;
  private authTokenSubscription: Subscription;
  private bomExportFeatureSubscription: Subscription;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.authTokenSubscription = this.authToken$.subscribe((authToken) => {
      this.token = authToken;
    });
    this.bomExportFeatureSubscription = this.bomExportFeature$.subscribe(
      (feature: BomExportFeature) => {
        if (feature.status?.progress === BomExportProgress.STARTED) {
          this.trackBomExportStatus();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authTokenSubscription) {
      this.authTokenSubscription.unsubscribe();
    }
    if (this.bomExportFeatureSubscription) {
      this.bomExportFeatureSubscription.unsubscribe();
    }
  }

  openDialog(): void {
    this.dialog.open(UserInteractionDialogComponent);
  }

  trackBomExportStatus(): void {
    let progress: BomExportProgress;

    fetchEventSource(`${API.v1}/${BomExportStatusLivePath}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      keepalive: true,
      cache: 'no-cache',
      onmessage: (message) => {
        const currentStatus = JSON.parse(message.data);
        progress = (currentStatus as BomExportStatus).progress;
        this.store.dispatch(updateBomExportStatus({ currentStatus }));
      },
      onclose: () => {
        if (
          progress === BomExportProgress.FINISHED ||
          progress === BomExportProgress.FAILED
        ) {
          this.store.dispatch(trackBomExportStatusCompleted());
        } else {
          this.store.dispatch(
            trackBomExportStatusFailure({
              errorMessage: 'Wrong progress when closing listener',
            })
          );
        }
      },
      onerror: (error) => {
        this.store.dispatch(
          trackBomExportStatusFailure({ errorMessage: error.message })
        );
        throw new Error('Error during bom export status tracking');
      },
    });
  }
}
