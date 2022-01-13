import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'goldwind-dashboard-more-info-dialog',
  templateUrl: './dashboard-more-info-dialog.component.html',
})
export class DashboardMoreInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DashboardMoreInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
