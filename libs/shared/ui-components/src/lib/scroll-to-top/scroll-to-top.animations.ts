import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const scrollToTopAnimations = [
  trigger('toggle', [
    state(
      'show',
      style({
        opacity: 1
      })
    ),
    state(
      'hide',
      style({
        opacity: 0
      })
    ),
    transition('* <=> *', animate('200ms ease-in-out'))
  ])
];
