import {
  Component,
  ContentChildren,
  Directive,
  input,
  InputSignal,
  QueryList,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Directive({
  selector: '[d360HeaderActionBarButtons], [d360HeaderActionBarChildren]',
})
export class ProjectedContendDirective {}

@Component({
  selector: 'd360-header-action-bar',
  imports: [MatDividerModule],
  templateUrl: './header-action-bar.component.html',
  styleUrls: ['./header-action-bar.component.scss'],
})
export class HeaderActionBarComponent {
  public wrapLeft: InputSignal<boolean> = input(false);
  public wrapRight: InputSignal<boolean> = input(false);

  @ContentChildren(ProjectedContendDirective)
  protected projectedContent: QueryList<ProjectedContendDirective>;

  protected get shouldRenderDivider(): boolean {
    return this.projectedContent && this.projectedContent.length === 2;
  }
}
