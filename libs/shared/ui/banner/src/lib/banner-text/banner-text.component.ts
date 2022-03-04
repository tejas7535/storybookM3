import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type BannerType = 'info' | 'success' | 'error' | 'warning' | '';
@Component({
  selector: 'schaeffler-banner-text',
  templateUrl: './banner-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerTextComponent {
  @Input() public text = '';
  @Input() public showFullText = false;
  @Input() public bannerIcon: BannerType = '';
  @Input() public truncateSize = 120;
  @Input() public buttonText = '';

  @Output()
  public readonly closeBanner: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly toggleFullText: EventEmitter<void> = new EventEmitter<void>();

  public setBannerIcon(bannerIcon: BannerType): string | undefined {
    switch (bannerIcon) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'cancel';
      case 'success':
        return 'check_circle';
      default:
        return undefined;
    }
  }

  public clickButton(): void {
    this.closeBanner.emit();
  }

  public toggleText(): void {
    this.toggleFullText.emit();
  }
}
