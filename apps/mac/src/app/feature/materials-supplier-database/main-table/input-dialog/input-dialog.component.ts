import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StringOption } from '@schaeffler/inputs';

@Component({
  selector: 'mac-input-dialog',
  templateUrl: './input-dialog.component.html',
})
export class InputDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<InputDialogComponent>) {}

  public years: Array<number>;
  public months: Array<number>;

  public options: StringOption[] = [
    { id: 'a', title: 'Option 1' },
    { id: 'b', title: 'Option 2' },
    { id: 'c', title: 'Option 3' },
  ];

  ngOnInit(): void {
    // create an array of months
    this.months = Array(12)
      .fill(0)
      .map((_, i) => i + 1);
    // create a list of years from 2000 to current
    let curYear = new Date().getFullYear();
    this.years = Array(curYear - 2000 + 1)
      .fill(1)
      .map((_, i) => curYear - i);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
