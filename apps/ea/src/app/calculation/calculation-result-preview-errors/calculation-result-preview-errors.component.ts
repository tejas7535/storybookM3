import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CalculationResultPreviewItem } from '@ea/core/store/models';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-result-preview-errors',
  templateUrl: './calculation-result-preview-errors.component.html',
  styleUrls: ['./calculation-result-preview-errors.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedTranslocoModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
  ],
})
export class CalculationResultPreviewErrorsComponent {
  @Input() public expanded = false;
  @Output() public expandedChange = new EventEmitter<boolean>();

  public inlineErrors = '';
  public inlineDownstreamErrors = '';
  public catalogCalculationData: CalculationResultPreviewItem[] = [];
  public downstreamCalculationData: CalculationResultPreviewItem[] = [];
  public affectedItems: CalculationResultPreviewItem[] = [];

  @Input() set errors(errors: string[]) {
    this.inlineErrors = '';
    if (errors?.length > 0) {
      this.inlineErrors = errors.join(' ');
    }
  }
  @Input() set downstreamErrors(errors: string[]) {
    this.inlineDownstreamErrors = '';
    if (errors.length > 0) {
      this.inlineDownstreamErrors = errors.join(' ');
    }
  }

  @Input()
  set overlayData(data: CalculationResultPreviewItem[]) {
    const downstreamItems = new Set(['emissions', 'frictionalPowerloss']);
    this.catalogCalculationData = data.filter(
      (item) => !downstreamItems.has(item.title)
    );
    this.downstreamCalculationData = data.filter((item) =>
      downstreamItems.has(item.title)
    );
  }

  public getAffectedItems(): CalculationResultPreviewItem[] {
    const items: CalculationResultPreviewItem[] = [];
    if (this.inlineErrors) {
      items.push(...this.catalogCalculationData);
    }
    if (this.inlineDownstreamErrors) {
      items.push(...this.downstreamCalculationData);
    }

    return items;
  }

  public getCombinedInlineErrors(): string {
    return [this.inlineErrors, this.inlineDownstreamErrors].join(' ');
  }

  toggleErrors() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}
