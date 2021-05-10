import { Observable } from 'rxjs';

export interface Tab {
  label$: string;
  link: string;
  disabled$?: Observable<boolean> | boolean;
}
