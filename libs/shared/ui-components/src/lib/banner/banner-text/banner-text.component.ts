import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'schaeffler-banner-text',
  templateUrl: './banner-text.component.html',
  styleUrls: ['./banner-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerTextComponent {
  @Input() public text: string;
  @Input() public showFullText: boolean;
  @Input() public truncateSize: number;
  @Input() public buttonText: string;

  // tslint:disable-next-line: prefer-inline-decorator
  @Output()
  public readonly closeBanner: EventEmitter<void> = new EventEmitter<void>();

  // tslint:disable-next-line: prefer-inline-decorator
  @Output()
  public readonly toggleFullText: EventEmitter<void> = new EventEmitter<void>();

  public clickButton(): void {
    this.closeBanner.emit();
  }

  public toggleText(): void {
    this.toggleFullText.emit();
  }
}
