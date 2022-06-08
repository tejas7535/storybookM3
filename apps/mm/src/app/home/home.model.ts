import { UntypedFormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { NestedPropertyMeta, PropertyMeta } from '@caeonline/dynamic-forms';

export interface PagedMeta extends NestedPropertyMeta {
  metas: PropertyMeta[];
  controls: UntypedFormControl[];
  valid$: Observable<boolean>;
}

export interface Value {
  key: number;
  pageId: string | number;
}

export interface Params {
  name: string;
  value: string | number;
}

export interface BearingParams {
  id: number;
  url: string;
  params: Params | Params[];
}
