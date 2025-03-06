import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() public withDot = true;
  @Input() public value = '';
  @Input() public size: 'small' | 'default' = 'default';

  public tagClassName = '';
  public dotClassName = '';

  @Input()
  public set styleClass(value: string) {
    this.tagClassName = `${this.tagClassName} ${value}`;
  }

  @Input({ required: true })
  public set type(
    value:
      | 'info'
      | 'warning'
      | 'error'
      | 'success'
      | 'neutral'
      | 'primary'
      | 'category2'
      | 'category3'
  ) {
    this.tagClassName = `tag-${value}`;
  }

  @Input()
  public set withBorder(value: boolean) {
    this.tagClassName = value
      ? `${this.tagClassName} tag-border`
      : this.tagClassName;
  }
}
