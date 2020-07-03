import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DEMO_TEXT_DREI_D_MASTERS } from '../../constants/demo-text-drei-d-masters.constants';
import { AppState, loadClassificationForText } from '../../core/store';
import { getClassificationTextInput } from '../../core/store/selectors/drei-d-master/drei-d-master.selector';
import { TextInput } from '../../shared/result/models';

@Component({
  selector: 'sta-drei-d-master',
  templateUrl: './drei-d-master.component.html',
  styleUrls: ['./drei-d-master.component.scss'],
})
export class DreiDMasterComponent implements OnInit {
  public DEMO_TEXT = DEMO_TEXT_DREI_D_MASTERS;

  public textInput$: Observable<TextInput>;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.setObservables();
  }
  private setObservables(): void {
    this.textInput$ = this.store.pipe(select(getClassificationTextInput));
  }

  public getClassificationForText(input: TextInput): void {
    this.store.dispatch(loadClassificationForText({ textInput: { ...input } }));
  }
}
