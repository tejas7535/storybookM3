import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Icon } from '@schaeffler/icons';

enum BannerIconTypes {
  info = 'icon-toast-information',
  warning = 'icon-toast-warning',
  error = 'icon-toast-error',
  success = 'icon-toast-success',
}

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
  public icon: Icon;

  // tslint:disable-next-line: prefer-inline-decorator
  @Output()
  public readonly closeBanner: EventEmitter<void> = new EventEmitter<void>();

  // tslint:disable-next-line: prefer-inline-decorator
  @Output()
  public readonly toggleFullText: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    switch (this.bannerIcon) {
      case 'info':
        this.icon = new Icon(BannerIconTypes.info);
        break;
      case 'warning':
        this.icon = new Icon(BannerIconTypes.warning);
        break;
      case 'error':
        this.icon = new Icon(BannerIconTypes.error);
        break;
      case 'success':
        this.icon = new Icon(BannerIconTypes.success);
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
