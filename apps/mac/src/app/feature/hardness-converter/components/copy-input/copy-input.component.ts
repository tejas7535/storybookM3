import { Clipboard } from '@angular/cdk/clipboard';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'mac-copy-input',
  templateUrl: './copy-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyInputComponent {
  @Input() label: string;
  @Input() value: number;
  @Input() warning: string;
  @Input() unit: string;
  @Input() tooltip?: string;
  @Input() precision? = 0;

  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly decimalPipe: DecimalPipe
  ) {}

  public get transformedValue(): string {
    return this.decimalPipe.transform(this.value, `1.0-${this.precision}`);
  }

  public onCopyButtonClick(): void {
    this.clipboard.copy(`${this.transformedValue}\u00A0${this.unit}`);
    this.snackbar.open('Value copied to clipboard', 'Close', {
      duration: 5000,
    });
  }
}
