import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { VisibilityState } from './enums/visibility-state.enum';

export const headerAnimations = [
  trigger('toggle', [
    state(
      VisibilityState.Hidden,
      style({ opacity: 0, transform: 'translateY(-100%)', zIndex: 0 })
    ),
    state(
      VisibilityState.Visible,
      style({ opacity: 1, transform: 'translateY(0)', zIndex: 10 })
    ),
    transition('* => *', animate('200ms ease-in'))
  ])
];
