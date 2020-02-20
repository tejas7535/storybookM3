import { Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SnackBarService } from '@schaeffler/shared/ui-components';

import { DataStoreService } from '../services/data-store.service';

import { fadeInAnimation } from '../../animations/fade-in-animation';

@Component({
  selector: 'sta-result-translation',
  templateUrl: './result-translation.component.html',
  styleUrls: ['./result-translation.component.scss'],
  animations: [fadeInAnimation]
})
export class ResultTranslationComponent implements OnChanges, OnInit {
  public loadingTranslation$: Observable<boolean>;

  @Input() public translation: string;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly snackBarService: SnackBarService,
    private readonly dataStore: DataStoreService
  ) {}

  public translationFormControl = new FormControl('');

  public ngOnInit(): void {
    this.loadingTranslation$ = this.dataStore.loadingTranslation$;
  }

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

    this.snackBarService.showSuccessMessage('Copied to clipboard');
  }
}
