import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'hc-copy-input',
  templateUrl: './copy-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
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
