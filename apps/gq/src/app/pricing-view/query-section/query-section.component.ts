import { Component } from '@angular/core';

@Component({
  selector: 'gq-query-section',
  templateUrl: './query-section.component.html',
  styleUrls: ['./query-section.component.scss'],
})
export class QuerySectionComponent {
  /**
   * Improves performance of ngFor.
   */
  public trackByFn(_index: number, item: number): number {
    return item;
  }
}
