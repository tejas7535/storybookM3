import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lsa-recommendation-table-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation-table-cell.component.html',
})
export class RecommendationTableCellComponent {
  @Input() border?: boolean;
  @Input() selected?: boolean;
  @Input() isLastRow?: boolean;
  @Input() isLastColumn?: boolean;
}
