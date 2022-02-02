import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

export type BannerIconType = 'info' | 'success' | 'error' | 'warning' | '';
@Component({
  selector: 'schaeffler-banner-text',
  templateUrl: './banner-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerTextComponent implements OnInit {
  @Input() public text = '';
  @Input() public showFullText = false;
  @Input() public bannerIcon: BannerIconType = '';
  @Input() public truncateSize = 120;
  @Input() public buttonText = '';

  public icon: string | undefined;

  @Output()
  public readonly closeBanner: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly toggleFullText: EventEmitter<void> = new EventEmitter<void>();

  public ngOnInit(): void {
    this.setBannerIcon();
  }

  public setBannerIcon(): void {
    switch (this.bannerIcon) {
      case 'info':
        this.icon = 'info';
        break;
      case 'warning':
        this.icon = 'warning';
        break;
      case 'error':
        this.icon = 'cancel';
        break;
      case 'success':
        this.icon = 'check_circle';
        break;
      default:
        this.icon = undefined;
    }
  }

  public clickButton(): void {
    this.closeBanner.emit();
  }

  public toggleText(): void {
    this.toggleFullText.emit();
  }
}
