import { animate, style, transition, trigger } from '@angular/animations';

export const sidenavToggleAnimation = trigger('sidenavToggleAnimation', [
  transition(':enter', [
    style({
      transform: 'translateY(100%)',
      opacity: 0,
    }),
    animate(
      '200ms ease-out',
      style({
        transform: 'translateY(0)',
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    style({
      transform: 'translateY(0)',
      opacity: 1,
    }),
    animate(
      '200ms ease-out',
      style({
        transform: 'translateY(-100%)',
        opacity: 0,
      })
    ),
  ]),
]);
