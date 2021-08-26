import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FeaturesDialogComponent } from './features-dialog/features-dialog.component';

@Component({
  selector: 'ia-add-analysis',
  templateUrl: './add-analysis.component.html',
})
export class AddAnalysisComponent {
  constructor(private readonly dialog: MatDialog) {}

  openDialog(): void {
    // TODO: Replace with data from store and use correct class
    const data: any[] = [
      {
        name: 'Age',
        selected: true,
      },
      {
        name: 'Gender',
        selected: false,
      },
      {
        name: 'Nationality',
        selected: false,
      },
      {
        name: 'Functional Area',
        selected: true,
      },
      {
        name: 'Functional Area',
        selected: true,
      },
      {
        name: 'Education',
        selected: true,
      },
      {
        name: 'Job',
        selected: false,
      },
      {
        name: 'Ressort',
        selected: false,
      },
      {
        name: 'Training Number',
        selected: false,
      },
      {
        name: 'Commuting Distance',
        selected: false,
      },
    ];
    this.dialog.open(FeaturesDialogComponent, {
      data,
    });
  }
}
