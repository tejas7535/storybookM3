import {
  Component,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Directive({
  selector: '[appHeaderActionBarButtons], [appHeaderActionBarChildren]',
  standalone: true,
})
export class ProjectedContendDirective {}

@Component({
  selector: 'app-header-action-bar',
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
