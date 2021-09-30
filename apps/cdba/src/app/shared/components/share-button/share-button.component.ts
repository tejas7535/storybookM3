import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cdba-share-button',
  template: ` <ng-container header *transloco="let t; read: 'shared.shareUrl'">
    <button
      mat-raised-button
      cdbaShareButton
      matTooltip="{{ t('tooltipMessage') }}"
    >
      <mat-icon class="text-[20px]">group</mat-icon>
      {{ t('button') }}
    </button>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareButtonComponent {}
