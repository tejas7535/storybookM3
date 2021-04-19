import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { NestedPropertyMeta, PropertyMeta } from '@caeonline/dynamic-forms';

export interface PagedMeta extends NestedPropertyMeta {
  metas: PropertyMeta[];
  controls: FormControl[];
  valid$: Observable<boolean>;
}
