import { Observable, Subscription } from 'rxjs';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { select, Store } from '@ngrx/store';
import { SnackBarService } from '@schaeffler/shared/ui-components';

import { TagsForFileInput } from '../../../core/store/reducers/tagging/models/tags-for-file-input.model';
import { TagsForTextInput } from '../../../core/store/reducers/tagging/models/tags-for-text-input.model';

import {
  addTagForFile,
  addTagForText,
  AppState,
  getSelectedTabIndexTagging,
  removeTagForFile,
  removeTagForText,
  setShowMoreTagsFile,
  setShowMoreTagsText
} from '../../../core/store';
import { fadeInAnimation } from '../../animations/fade-in-animation';

@Component({
  selector: 'sta-result-auto-tagging',
  templateUrl: './result-auto-tagging.component.html',
  styleUrls: ['./result-auto-tagging.component.scss'],
  animations: [fadeInAnimation]
})
export class ResultAutoTaggingComponent implements OnInit, OnDestroy {
  @Input() public tags: TagsForTextInput | TagsForFileInput;

  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public selectedTabIndex$: Observable<number>;
  public selectedTabIndex: number;

  public readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly snackBarService: SnackBarService,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.store
        .pipe(select(getSelectedTabIndexTagging))
        .subscribe((selectedTabIndex: number) => {
          this.selectedTabIndex = selectedTabIndex;
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Add a manual input to tags
   */
  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // add value
    if (value) {
      if (this.selectedTabIndex === 0) {
        this.store.dispatch(addTagForText({ tag: value.trim() }));
      } else if (this.selectedTabIndex === 1) {
        this.store.dispatch(addTagForFile({ tag: value.trim() }));
      }
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
    if (this.selectedTabIndex === 0) {
      this.store.dispatch(removeTagForText({ tag }));
    } else if (this.selectedTabIndex === 1) {
      this.store.dispatch(removeTagForFile({ tag }));
    }
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
    selBox.value = this.tags.tags.join(', ');
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
  public trackByFn(index: number): number {
    return index;
  }

  /**
   * Show more tags if possible
   */
  public showMoreTags(): void {
    if (this.selectedTabIndex === 0) {
      this.store.dispatch(setShowMoreTagsText({ showMoreTags: true }));
    } else if (this.selectedTabIndex === 1) {
      this.store.dispatch(setShowMoreTagsFile({ showMoreTags: true }));
    }
  }
}
