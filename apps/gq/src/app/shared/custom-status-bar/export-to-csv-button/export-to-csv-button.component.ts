import { Component } from '@angular/core';

@Component({
  selector: 'gq-remove-from-offer',
  templateUrl: './export-to-csv-button.component.html',
  styleUrls: ['./export-to-csv-button.component.scss'],
})
export class ExportToCsvButtonComponent {
  agInit(): void {}

  exportToCSV(): void {
    alert('export to CSV not yet Implemented');
  }
}
