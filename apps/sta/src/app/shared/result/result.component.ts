import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Icon } from '@schaeffler/shared/icons';

import {
  AppState,
  getSelectedTabIndexTagging,
  getTagsForFile,
  getTagsForText,
  resetAll
} from '../../core/store';
import { TagsForFileInput } from '../../core/store/reducers/tagging/models/tags-for-file-input.model';
import { TagsForTextInput } from '../../core/store/reducers/tagging/models/tags-for-text-input.model';
import { ServiceType } from './models';
import { DataStoreService } from './services/data-store.service';

@Component({
  selector: 'sta-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  @Input() public currentService: ServiceType;

  public translation$: Observable<string>;
  public appIcon = new Icon('format_quote', true);

  public tagsForText$: Observable<TagsForTextInput>;
  public tagsForFile$: Observable<TagsForFileInput>;
  public tagsForText: TagsForTextInput;
  public tagsForFile: TagsForFileInput;
  public selectedTabIndexTagging: number;

  public serviceType = ServiceType;

  public readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly dataStore: DataStoreService,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.store
        .pipe(select(getSelectedTabIndexTagging))
        .subscribe((selectedTabIndexTagging: number) => {
          this.selectedTabIndexTagging = selectedTabIndexTagging;
        })
    );
    this.subscription.add(
      this.store
        .pipe(select(getTagsForText))
        .subscribe((tagsForText: TagsForTextInput) => {
          this.tagsForText = tagsForText;
        })
    );
    this.subscription.add(
      this.store
        .pipe(select(getTagsForFile))
        .subscribe((tagsForFile: TagsForFileInput) => {
          this.tagsForFile = tagsForFile;
        })
    );
    this.setObservables();
  }

  private setObservables(): void {
    this.translation$ = this.dataStore.translation$;

    this.tagsForText$ = this.store.pipe(select(getTagsForText));
    this.tagsForFile$ = this.store.pipe(select(getTagsForFile));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public reset(): void {
    this.dataStore.reset();
    this.store.dispatch(resetAll());
  }
}
