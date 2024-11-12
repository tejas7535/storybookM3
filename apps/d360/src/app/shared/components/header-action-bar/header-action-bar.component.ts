import {
  Component,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Directive({
  selector: '[d360HeaderActionBarButtons], [d360HeaderActionBarChildren]',
  standalone: true,
})
export class ProjectedContendDirective {}

@Component({
  selector: 'd360-header-action-bar',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './header-action-bar.component.html',
  styleUrls: ['./header-action-bar.component.scss'],
})
export class HeaderActionBarComponent {
  @ContentChildren(ProjectedContendDirective)
  projectedContent: QueryList<ProjectedContendDirective>;

  get shouldRenderDivider(): boolean {
    return this.projectedContent && this.projectedContent.length === 2;
  }
}
