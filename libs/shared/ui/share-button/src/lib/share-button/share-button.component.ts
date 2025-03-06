import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'schaeffler-share-button',
  template: ` <ng-container *transloco="let t">
    <button
      mat-raised-button
      schaefflerShareButton
      matTooltip="{{ t('tooltipMessage') }}"
    >
      <mat-icon class="pt-[1px]">group</mat-icon>
      {{ t('button') }}
    </button>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ShareButtonComponent {}
