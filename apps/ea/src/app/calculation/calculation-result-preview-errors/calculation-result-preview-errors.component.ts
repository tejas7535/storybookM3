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
  public catalogCalculationData: CalculationResultPreviewItem[] = [];
  @Input() set errors(errors: string[]) {
    this.inlineErrors = '';
    if (errors.length > 0) {
      this.inlineErrors = errors.join(' ');
    }
  }

  @Input()
  set overlayData(data: CalculationResultPreviewItem[]) {
    this.catalogCalculationData = data.filter(
      (item) => !item.title.includes('emissions')
    );
  }

  toggleErrors() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}
