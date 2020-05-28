import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  AppState,
  getSelectedTabIndexTagging,
  getTagsForFile,
  getTagsForText,
  resetAll,
} from '../../core/store';
import { TagsForFileInput } from '../../core/store/reducers/tagging/models/tags-for-file-input.model';
import { TagsForTextInput } from '../../core/store/reducers/tagging/models/tags-for-text-input.model';
import {
  getSelectedTabIndexTranslation,
  getTranslationForFile,
  getTranslationForText,
} from '../../core/store/selectors/translation/translation.selector';
import { ServiceType } from './models';

@Component({
  selector: 'sta-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() public currentService: ServiceType;

  public translation$: Observable<string>;

  public tagsForText$: Observable<TagsForTextInput>;
  public tagsForFile$: Observable<TagsForFileInput>;
  public selectedTabIndexTagging$: Observable<number>;

  public translationForText$: Observable<string>;
  public translationForFile$: Observable<string>;
  public selectedTabIndexTranslation$: Observable<number>;

  public serviceType = ServiceType;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  private setObservables(): void {
    this.tagsForText$ = this.store.pipe(select(getTagsForText));
    this.tagsForFile$ = this.store.pipe(select(getTagsForFile));
    this.selectedTabIndexTagging$ = this.store.pipe(
      select(getSelectedTabIndexTagging)
    );

    this.translationForText$ = this.store.pipe(select(getTranslationForText));
    this.translationForFile$ = this.store.pipe(select(getTranslationForFile));
    this.selectedTabIndexTranslation$ = this.store.pipe(
      select(getSelectedTabIndexTranslation)
    );
  }

  public reset(): void {
    this.store.dispatch(resetAll());
  }
}
