import { Observable, of } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { TaggingService } from './tagging.service';

import { AUTO_TAGGING_DEMO } from './constants/auto-tagging-demo.constant';

import { InputText } from './models';

@Component({
  selector: 'sta-auto-tagging',
  templateUrl: './auto-tagging.component.html',
  styleUrls: ['./auto-tagging.component.scss']
})
export class AutoTaggingComponent implements OnInit {
  public tags$: Observable<String[]>;
  public textFormControl: FormControl;

  public minLength = 40;

  constructor(
    private readonly taggingService: TaggingService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.textFormControl = new FormControl(AUTO_TAGGING_DEMO, [
      Validators.required,
      Validators.minLength(this.minLength)
    ]);
  }

  /**
   * Get Tags from API for given text.
   */
  public getTags(): void {
    this.tags$ = this.taggingService.getTags(
      new InputText(this.textFormControl.value)
    );
  }

  /**
   * Remove tag from received tags.
   */
  public remove(tags: string[], tag: string): void {
    this.tags$ = of(tags.filter(el => el !== tag));
  }

  /**
   * Copy current tags to clipboard.
   */
  public copyToClipBoard(tags: string[]): void {
    // TODO: Use ClipboardModule with Angular CDK 9
    const selBox = this.document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = tags.join(', ');
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index): number {
    return index;
  }
}
