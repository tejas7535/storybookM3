import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'schaeffler-share-button',
  template: ` <ng-container *transloco="let t">
    <button
      mat-raised-button
      schaefflerShareButton
      matTooltip="{{ t('tooltipMessage') }}"
    >
      <mat-icon>group</mat-icon>
      {{ t('button') }}
    </button>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareButtonComponent {}
