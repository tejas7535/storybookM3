import { Observable } from 'rxjs';

export interface Tab {
  label$: Observable<string>;
  link: string;
}
