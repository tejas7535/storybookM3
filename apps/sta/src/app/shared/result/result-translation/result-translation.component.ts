import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  SnackBarComponent,
  SnackBarMessageType
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'sta-result-translation',
  templateUrl: './result-translation.component.html',
  styleUrls: ['./result-translation.component.scss']
})
export class ResultTranslationComponent implements OnChanges {
  @Input() public translation: string;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly snackBar: MatSnackBar
  ) {}

  public translationFormControl = new FormControl('');

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.translation) {
      this.translationFormControl.setValue(changes.translation.currentValue);
    }
  }

  /**
   * Copy current translation to clipboard.
   */
  public copyToClipBoard(): void {
    // TODO: Use ClipboardModule with Angular CDK 9
    const selBox = this.document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.translationFormControl.value;
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);

    this.showCopiedToClipboardToast();
  }

  /**
   * Show notification on copy click
   */
  private showCopiedToClipboardToast(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: 'success-message',
      data: {
        message: 'Copied to clipboard',
        type: SnackBarMessageType.SUCCESS
      }
    });
    snackBarRef.instance.snackBarRef = snackBarRef;
  }
}
