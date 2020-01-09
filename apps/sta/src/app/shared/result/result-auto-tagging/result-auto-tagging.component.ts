import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

import {
  SnackBarComponent,
  SnackBarService
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'sta-result-auto-tagging',
  templateUrl: './result-auto-tagging.component.html',
  styleUrls: ['./result-auto-tagging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultAutoTaggingComponent implements OnChanges {
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public showMoreTagsBtnEnabled = false;
  public subsetTags: string[];

  private readonly MAX_TAGS = 20;
  private readonly MIN_TAGS = 15;

  @Input() public tags: string[];

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly snackBarService: SnackBarService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.tags && changes.tags.currentValue) {
      this.subsetTags = this.showMoreTagsBtnEnabled
        ? changes.tags.currentValue.slice(0, this.MAX_TAGS)
        : changes.tags.currentValue.slice(0, this.MIN_TAGS);
      const enableMoreButton =
        changes.tags.currentValue.length >= this.MIN_TAGS;

      this.showMoreTagsBtnEnabled =
        this.showMoreTagsBtnEnabled || !enableMoreButton ? true : false;
    }
  }

  /**
   * Add a manual input to tags
   */
  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // add value
    if (value) {
      this.subsetTags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes a tag from tags
   */
  public remove(tag: string): void {
    this.subsetTags = this.subsetTags.filter(el => el !== tag);
  }

  /**
   * Copy current tags to clipboard
   */
  public copyToClipBoard(): void {
    // TODO: Use ClipboardModule with Angular CDK 9
    const selBox = this.document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.subsetTags.join(', ');
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);

    this.snackBarService.showSuccessMessage('Copied to clipboard');
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index): number {
    return index;
  }

  /**
   * Show more tags if possible
   */
  public showMoreTags(): void {
    this.showMoreTagsBtnEnabled = true;
    if (this.tags && this.tags.length > this.MIN_TAGS) {
      const remainingSubset = this.tags.slice(this.MIN_TAGS - 1, this.MAX_TAGS);
      this.subsetTags = this.subsetTags.concat(
        remainingSubset.filter(
          el => !this.subsetTags.find(existingEl => existingEl === el)
        )
      );
    }
  }
}
