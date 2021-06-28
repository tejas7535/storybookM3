import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input() showBackButton = true;
  @Input() title: string;
  @Input() breadcrumbs: any[];
}
