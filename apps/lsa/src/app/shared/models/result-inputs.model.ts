import { Observable } from 'rxjs';

export interface ResultInputModel {
  sections: LubricationInputSection[];
}

export interface LubricationInputSection {
  title$: Observable<string>;
  stepIndex: number;
  inputs$: Observable<LubricationInput[]>;
}

export interface LubricationInput {
  title: string;
  value: string | number;
  remoteValue?: string | number;
}
