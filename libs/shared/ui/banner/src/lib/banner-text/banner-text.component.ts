import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'schaeffler-banner-text',
  templateUrl: './banner-text.component.html',
  styleUrls: ['./banner-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerTextComponent implements OnInit {
  @Input() public text: string;
  @Input() public showFullText: boolean;
  @Input() public bannerIcon: string;
  @Input() public truncateSize: number;
  @Input() public buttonText: string;
  public icon: string;

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
